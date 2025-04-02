import env from '#start/env'

import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes.js'
import * as mercadopago from '#config/mercadopago'

export class MercadoPagoService {
    private connected: boolean = false
    private client: MercadoPagoConfig
    private payment: Payment
    private preference: Preference

    constructor() {
        this.client = new MercadoPagoConfig({
            accessToken: env.get('MERCADOPAGO_ACCESS_TOKEN'),
            options: { timeout: 5000 },
        })
        this.payment = new Payment(this.client)
        this.preference = new Preference(this.client)
    }

    async getPayment(paymentId: string | number) {
        return await this.payment.get({
            id: paymentId,
            requestOptions: { timeout: 5000 },
        })
    }

    async getPreference(preferenceId: string) {
        return await this.preference.get({
            preferenceId,
            requestOptions: { timeout: 5000 },
        })
    }

    async createPreference(
        externalRef: string,
        price: number
    ): Promise<PreferenceResponse | undefined> {
        const preferenceResponse = await this.preference.create({
            body: {
                external_reference: externalRef,
                statement_descriptor: mercadopago.statementDescriptor,
                notification_url: mercadopago.notificationUrl,
                auto_return: mercadopago.autoReturn,
                additional_info: mercadopago.adicionalInfo,
                back_urls: mercadopago.backUrls(),
                payment_methods: mercadopago.paymentMethods(),
                items: [mercadopago.donateItemFaker(price)],
            },
        })

        return preferenceResponse
    }
}
