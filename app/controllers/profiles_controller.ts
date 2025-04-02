import { ProfileService } from '#services/profile_service'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateProfilePayload, UpdateProfilePayload } from '../payloads/profile_payload.js'
import Profile from '#models/profile'
import { createProfileValidator, updateProfileValidator } from '#validators/profile'
import logger from '@adonisjs/core/services/logger'
import { inject } from '@adonisjs/core'
import { FileService } from '#services/file_service'

@inject()
export default class ProfilesController {
    constructor(
        protected profileService: ProfileService,
        protected fileService: FileService
    ) {}

    async store({ request, response }: HttpContext) {
        const payload: CreateProfilePayload = await createProfileValidator.validate({
            name: request.input('name'),
            email: request.input('email'),
            biography: request.input('biography'),
            avatar: request.file('avatar'),
        })

        const createdProfile = await Profile.create({
            name: payload.name,
            email: payload.email,
            biography: payload.biography,
            avatar: await this.fileService.getBufferFromMultipartFile(payload.avatar),
        })

        if (!createdProfile) {
            return response.badRequest({ message: 'Error creating profile.' })
        }

        const profileKey = await this.profileService.generateProfileKey(createdProfile.id)
        if (!profileKey) {
            createdProfile.delete()
            return response.badRequest({ message: 'Error generating profile key.' })
        }

        createdProfile.random = profileKey.randomPart
        await createdProfile.save()

        logger.info('CREATED PROFILE %s %s', createdProfile.id, profileKey)

        return response.created({
            profile: createdProfile,
            profileKey,
        })
    }

    async show({ response, params }: HttpContext) {
        await Profile.query().preload('orders')
        await Profile.query().preload('orderHistory')
        await Profile.query().preload('messageHistory')

        const profile = await Profile.find(params.id)
        if (!profile) {
            return response.notFound({ message: 'Profile not found.' })
        }

        await profile.load('orders')
        await profile.load('orderHistory')
        await profile.load('messageHistory')

        return response.ok({ profile })
    }

    async update({ request, response, profile }: HttpContext) {
        const payload: UpdateProfilePayload = await request.validateUsing(updateProfileValidator)

        if (!payload) {
            return response.badRequest({ message: 'Error updating profile.' })
        }

        if (payload.name) profile.name = payload.name
        if (payload.email) profile.email = payload.email
        if (payload.biography) profile.biography = payload.biography
        if (payload.avatar)
            profile.avatar = await this.fileService.getBufferFromMultipartFile(payload.avatar)

        profile.save()

        logger.info('UPDATED PROFILE %s', JSON.stringify(profile.serialize()))

        return response.ok({ profile })
    }
}
