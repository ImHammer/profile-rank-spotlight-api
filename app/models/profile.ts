import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Order from './order.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import OrderHistory from './order_history.js'
import MessageHistory from './message_history.js'

export default class Profile extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({})
    declare active: boolean

    @column({})
    declare random?: string

    @column({})
    declare name: string

    @column({})
    declare email?: string

    @column({})
    declare biography?: string

    @column({
        serializeAs: null,
    })
    declare avatar: Buffer | null

    @column({})
    declare balance: number

    @column({})
    declare lastOrderDate?: DateTime

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @hasMany(() => Order)
    declare orders: HasMany<typeof Order>

    @hasMany(() => OrderHistory)
    declare orderHistory: HasMany<typeof OrderHistory>

    @hasMany(() => MessageHistory)
    declare messageHistory: HasMany<typeof MessageHistory>
}
