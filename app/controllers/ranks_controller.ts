import Profile from '#models/profile'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class RanksController {
    async index({ response }: HttpContext) {
        await Profile.query().preload('orders')

        const profiles = await Profile.query()
            .select('profiles.*')
            .select(db.raw('COALESCE(SUM(order_histories.total_amount), 0) AS balance'))
            .select(db.raw('MAX(order_histories.created_at) AS last_order_date'))
            .leftJoin('order_histories', 'profiles.id', '=', 'order_histories.profile_id')
            .groupBy('profiles.id')
            .orderBy('balance', 'desc')
            .orderBy('lastOrderDate', 'desc')

        return response.ok({ rank: profiles })
    }
}
