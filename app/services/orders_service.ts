import { inject } from '@adonisjs/core'
import { MercadoPagoService } from './mercado_pago_service.js'
import { MercadoPagoNotifyPayload } from '../payloads/mercadopago_notify_payload.js'
import InvalidPayloadErrorException from '#exceptions/invalid_payload_error_exception'
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes.js'
import { getOrderStatusByCode, OrderStatus } from '../enums/OrderStatus.js'
import Order from '#models/order'
import { Payment, Preference } from 'mercadopago'
import * as uuid from 'uuid'
import OrderHistory from '#models/order_history'
import { CreateOrderPayload } from '../payloads/order_payload.js'
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes.js'
import Profile from '#models/profile'

export class MPPaymentOrder {
    declare externalReference: string
    declare totalPaidAmount: number
    declare totalRefundedAmount: number
    declare totalAmount: number
    declare paymentStatus: OrderStatus

    constructor(private mpPayment: PaymentResponse) {
        if (!mpPayment) {
            throw new InvalidPayloadErrorException()
        }

        this.externalReference = mpPayment.external_reference || ''
        this.totalPaidAmount = mpPayment.transaction_amount || 0
        this.totalRefundedAmount = mpPayment.transaction_amount_refunded || 0

        this.totalAmount = this.totalPaidAmount - this.totalRefundedAmount
        this.paymentStatus = getOrderStatusByCode(mpPayment.status || OrderStatus.PENDING)
    }
}

@inject()
export class OrdersService {
    constructor(private mercadoPagoService: MercadoPagoService) {}

    async createOrder(profile: Profile, createOrderPayload: CreateOrderPayload) {
        const externalRef = uuid.v4()

        const preference = await this.mercadoPagoService.createPreference(
            externalRef,
            createOrderPayload.amount
        )

        if (!preference) {
            throw new InvalidPayloadErrorException()
        }

        return await Order.create({
            profileId: profile.id,
            externalReference: externalRef,
            totalAmount: createOrderPayload.amount,
            status: OrderStatus.OPEN,
            mpPreferenceId: preference.id || '',
        })
    }

    async webhookPayment(mercadoPagoNotify: MercadoPagoNotifyPayload) {
        if (!mercadoPagoNotify.data || !mercadoPagoNotify.data.id) {
            throw new InvalidPayloadErrorException()
        }

        const paymentId = mercadoPagoNotify.data.id
        const mpPayment = new MPPaymentOrder(await this.mercadoPagoService.getPayment(paymentId))

        const order = await Order.query()
            .where('externalReference', mpPayment.externalReference)
            .first()

        if (!order) {
            throw new InvalidPayloadErrorException()
        }

        order.mpPaymentId = paymentId
        order.status = mpPayment.paymentStatus

        if (order.totalAmount !== mpPayment.totalAmount) {
            order.status = OrderStatus.IN_PROCESS
        }

        await order.save()

        switch (order.status) {
            case OrderStatus.APPROVED:
                await OrderHistory.updateOrCreate(
                    { orderId: order.id },
                    {
                        orderId: order.id,
                        profileId: order.profileId,
                        totalAmount: order.totalAmount,
                    }
                )
                break
            case OrderStatus.REFUNDED:
            case OrderStatus.REJECTED:
            case OrderStatus.CANCELLED:
            case OrderStatus.CHARGED_BACK:
                await OrderHistory.query().where('orderId', order.id).delete()
                break
        }

        return mpPayment
    }
}
