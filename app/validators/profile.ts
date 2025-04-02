import vine from '@vinejs/vine'

export const createProfileValidator = vine.compile(
    vine.object({
        name: vine.string(),
        email: vine.string(),
        biography: vine.string(),
        avatar: vine.file({
            size: '3mb',
            extnames: ['jpg', 'png', 'jpeg'],
        }),
    })
)

export const updateProfileValidator = vine.compile(
    vine.object({
        name: vine.string().optional(),
        email: vine.string().optional(),
        biography: vine.string().optional(),
        avatar: vine
            .file({
                size: '3mb',
                extnames: ['jpg', 'png', 'jpeg'],
            })
            .optional(),
    })
)
