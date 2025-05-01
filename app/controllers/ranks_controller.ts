import Profile from '#models/profile'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { RankProfilePayload } from '../payloads/profile_payload.js'

export default class RanksController {
    async index({ response }: HttpContext) {
        await Profile.query().preload('orders')

        const profiles = await Profile.query()
            .select('profiles.*')
            .select(db.raw('COALESCE(SUM(order_histories.total_amount), 0) AS balance'))
            .select(db.raw('MAX(order_histories.created_at) AS last_order_date'))
            .select(
                db.raw(
                    `ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(order_histories.total_amount), 0) DESC, MAX(order_histories.created_at) DESC) AS rank`
                )
            )
            .leftJoin('order_histories', 'profiles.id', '=', 'order_histories.profile_id')
            .groupBy('profiles.id')
            .orderBy('balance', 'desc')
            .orderBy('lastOrderDate', 'desc')

        return response.ok({
            rank: profiles.map(
                (profile): RankProfilePayload => ({
                    id: profile.id,
                    rank: profile.rank,
                    name: profile.name,
                    bio: profile.biography,
                    totalAmount: profile.balance,
                })
            ),
        })
    }
}
