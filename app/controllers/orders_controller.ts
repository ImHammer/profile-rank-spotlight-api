import type { HttpContext } from '@adonisjs/core/http'
import { CreateOrderPayload } from '../payloads/order_payload.js'
import { createOrderValidator } from '#validators/order'
import Order from '#models/order'
import { inject } from '@adonisjs/core'
import { MercadoPagoService } from '#services/mercado_pago_service'
import { MercadoPagoNotifyPayload } from '../payloads/mercadopago_notify_payload.js'
import { OrdersService } from '#services/orders_service'

@inject()
export default class OrdersController {
    constructor(
        protected mercadoPagoService: MercadoPagoService,
        protected ordersService: OrdersService
    ) {}

    async store({ request, response, profile }: HttpContext) {
        const orderPayload: CreateOrderPayload = await request.validateUsing(createOrderValidator)

        const order: Order = await this.ordersService.createOrder(profile, orderPayload)
        const preference = await this.mercadoPagoService.getPreference(order.mpPreferenceId)

        return response.created({ order, preference })
    }

    async notify({ request, response }: HttpContext) {
        const mercadoPagoNotifyPayload: MercadoPagoNotifyPayload = request.all()

        switch (mercadoPagoNotifyPayload.type) {
            case 'payment':
                await this.ordersService.webhookPayment(mercadoPagoNotifyPayload)
                return response.ok({ message: 'OK!' })
            default:
                return response.notImplemented({ message: 'Not implemented!' })
        }
    }
}
