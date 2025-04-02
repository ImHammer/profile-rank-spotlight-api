export enum OrderStatus {
    PENDING = 'pending', // O usuário ainda não concluiu o pagamento
    APPROVED = 'approved', // O pagamento foi aprovado e creditado com sucesso
    AUTHORIZED = 'authorized', // O pagamento foi autorizado, mas não capturado
    IN_PROCESS = 'in_process', // O pagamento está em análise
    IN_MEDIATION = 'in_mediation', // O usuário iniciou uma disputa
    REJECTED = 'rejected', // O pagamento foi rejeitado (pode tentar novamente)
    CANCELLED = 'cancelled', // O pagamento foi cancelado ou expirou
    REFUNDED = 'refunded', // O pagamento foi reembolsado ao usuário
    CHARGED_BACK = 'charged_back', // Chargeback aplicado no cartão do comprador
    OPEN = 'open', // O pagamento foi criado mas ainda não foi capturado
    ERROR = 'error', // Erro no pagamento
}

export const getOrderStatusByCode = (code: string): OrderStatus => {
    switch (code) {
        case 'approved':
            return OrderStatus.APPROVED
        case 'authorized':
            return OrderStatus.AUTHORIZED
        case 'in_process':
            return OrderStatus.IN_PROCESS
        case 'in_mediation':
            return OrderStatus.IN_MEDIATION
        case 'rejected':
            return OrderStatus.REJECTED
        case 'cancelled':
            return OrderStatus.CANCELLED
        case 'refunded':
            return OrderStatus.REFUNDED
        case 'charged_back':
            return OrderStatus.CHARGED_BACK
        case 'open':
            return OrderStatus.OPEN
        case 'error':
            return OrderStatus.ERROR
        default:
            return OrderStatus.PENDING
    }
}
