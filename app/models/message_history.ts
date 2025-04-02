import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MessageHistory extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare message: string

    @column()
    declare profileId: number

    @column()
    declare orderId: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime
}
