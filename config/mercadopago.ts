import env from '#start/env'
import { Items } from 'mercadopago/dist/clients/commonTypes.js'
import { BackUrls, PaymentMethods } from 'mercadopago/dist/clients/preference/commonTypes.js'

const clientDomainUrl = env.get('CLIENT_DOMAIN_URL')
const serverDomainUrl = env.get('SERVER_DOMAIN_URL')

export const autoReturn = 'all'
export const adicionalInfo = 'DOE PARA AJUDAR UMA VIDA :)'
export const notificationUrl = `${serverDomainUrl}/api/orders/notify`
export const statementDescriptor = 'DOA. PROFILERANK'

export const paymentMethods = (): PaymentMethods => ({
    excluded_payment_methods: [
        {
            id: 'bolbradesco',
        },
        {
            id: 'pec',
        },
    ],
    excluded_payment_types: [
        {
            id: 'debit_card',
        },
    ],
    installments: 1,
})

export const backUrls = (): BackUrls => ({
    success: `${clientDomainUrl}/buyed/success`,
    failure: `${clientDomainUrl}/buyed/failure`,
    pending: `${clientDomainUrl}/buyed/pending`,
})

export const donateItemFaker = (price: number): Items => ({
    id: 'no-product',
    title: 'SUA DOAÇÃO',
    quantity: 1,
    unit_price: price,
})
