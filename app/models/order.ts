import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Profile from './profile.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { OrderStatus } from '../enums/OrderStatus.js'

export default class Order extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare profileId: number

    @column()
    declare totalAmount: number

    @column()
    declare mpPaymentId?: number

    @column()
    declare mpPreferenceId: string

    @column()
    declare externalReference: string

    @column()
    declare status: OrderStatus

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => Profile)
    declare profile: BelongsTo<typeof Profile>
}
