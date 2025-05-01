import vine from '@vinejs/vine'
import { cpfRule } from './rules/cpf.js'

export const createOrderValidator = vine.compile(
    vine.object({
        identity: vine.string().use(cpfRule({})),
        amount: vine.number().min(1).max(9999),
        message: vine.string().maxLength(1000),
    })
)
