import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class OrderHistory extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare orderId: number

    @column()
    declare profileId: number

    @column()
    declare totalAmount: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime
}
