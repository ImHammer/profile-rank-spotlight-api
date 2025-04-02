import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'message_histories'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()

            table.string('message', 1000).notNullable().defaultTo('')
            table.integer('profile_id').notNullable().unsigned()
            table.integer('order_id').notNullable().unsigned()

            table.timestamp('created_at')

            table.foreign('profile_id').references('id').inTable('profiles')
            table.foreign('order_id').references('id').inTable('orders')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
