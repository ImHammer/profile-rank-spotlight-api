import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
    vine.object({
        amount: vine.number().min(1).max(9999),
        message: vine.string().maxLength(1000),
    })
)
