import Profile from '#models/profile'
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class InitKeyMiddleware {
    handle(ctx: HttpContext, next: NextFn): Promise<any> {
        return next()
    }
}
declare module '@adonisjs/core/http' {
    interface HttpContext {
        profile: Profile
    }
}
