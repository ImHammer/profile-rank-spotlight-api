import { BaseSchema } from '@adonisjs/lucid/schema'
import { OrderStatus } from '../../app/enums/OrderStatus.js'

export default class extends BaseSchema {
    protected tableName = 'orders'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()

            table.integer('profile_id').notNullable().unsigned()
            table.integer('mp_payment_id').nullable().unique()
            table.decimal('total_amount', 15, 2).notNullable().defaultTo('0.00')
            table.string('external_reference').notNullable().unique()
            table.string('mp_preference_id').notNullable().unique()

            table
                .enum('status', Object.values(OrderStatus))
                .notNullable()
                .defaultTo(OrderStatus.OPEN)

            table.timestamp('created_at')
            table.timestamp('updated_at')

            table
                .foreign('profile_id')
                .references('id')
                .inTable('profiles')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
