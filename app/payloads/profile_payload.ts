import { MultipartFile } from '@adonisjs/core/bodyparser'

export interface CreateProfilePayload {
    name: string // NAME OF THE PROFILE
    email?: string // EMAIL OF PROFILE FOR PROPOSAUS PAYMENTS
    biography?: string // BIOGRAPHY OF THE PROFILE
    avatar: MultipartFile // IMAGE PROFILE IN BASE64 ENCODED
}

export interface UpdateProfilePayload {
    name?: string // NAME OF THE PROFILE
    email?: string // EMAIL OF PROFILE FOR PROPOSAUS PAYMENTS
    biography?: string // BIOGRAPHY OF THE PROFILE
    avatar?: MultipartFile // IMAGE PROFILE IN BASE64 ENCODED
}
