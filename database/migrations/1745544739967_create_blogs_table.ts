import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'blogs'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.string('title', 255).notNullable()
            table.string('resumed', 500).defaultTo('')
            table.text('content').defaultTo('')

            table.binary('image').nullable()

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
