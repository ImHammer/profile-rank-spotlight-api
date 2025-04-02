import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'order_histories'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()

            table.integer('order_id').notNullable().unsigned()
            table.integer('profile_id').notNullable().unsigned()
            table.decimal('total_amount', 15, 2).notNullable().defaultTo('0.00')

            table.timestamp('created_at')
            table.timestamp('updated_at')

            table
                .foreign('order_id')
                .references('id')
                .inTable('orders')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
