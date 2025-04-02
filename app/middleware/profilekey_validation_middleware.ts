import Profile from '#models/profile'
import { ProfileService } from '#services/profile_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

@inject()
export default class ProfilekeyValidationMiddleware {
    constructor(protected profileService: ProfileService) {}
    async handle(ctx: HttpContext, next: NextFn) {
        const { request, response } = ctx

        if (!request.header('authorization')) {
            return response.unauthorized({ message: 'Unauthorized' })
        }

        const [header, profileKey] = request.header('authorization')?.split(' ') || []

        if (header !== 'Bearer' || !profileKey) {
            return response.unauthorized({ message: 'Unauthorized' })
        }

        const decodeProfileKey = await this.profileService.validateProfileKey(profileKey)

        if (!decodeProfileKey) {
            return response.unauthorized({ message: 'Unauthorized' })
        }

        const profile = await Profile.find(decodeProfileKey.id)

        if (!profile || !profile.active) {
            return response.unauthorized({ message: 'Unauthorized' })
        }

        if (profile.random != decodeProfileKey.randomPart) {
            return response.unauthorized({ message: 'Unauthorized' })
        }

        ctx.profile = profile

        return await next()
    }
}
