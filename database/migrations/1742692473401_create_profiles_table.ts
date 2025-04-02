import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'profiles'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()

            table.boolean('active').notNullable().defaultTo(true)

            table.string('random').nullable()
            table.string('name', 50).notNullable()
            table.string('email').notNullable()
            table.string('biography').notNullable().defaultTo('')

            table.binary('avatar').nullable()

            table.decimal('balance', 15, 2).notNullable().defaultTo('0.00')

            table.timestamp('last_order_date').nullable()
            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
