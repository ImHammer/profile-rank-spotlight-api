import vine from '@vinejs/vine'

export const createProfileValidator = vine.compile(
    vine.object({
        name: vine.string().alphaNumeric().maxLength(50),
        email: vine.string().email().maxLength(30),
        biography: vine.string().maxLength(1000),
        avatar: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg'],
        }),
    })
)

export const updateProfileValidator = vine.compile(
    vine.object({
        name: vine.string().alphaNumeric().maxLength(50).optional(),
        email: vine.string().email().maxLength(30).optional(),
        biography: vine.string().maxLength(1000).optional(),
        avatar: vine
            .file({
                size: '2mb',
                extnames: ['jpg', 'png', 'jpeg'],
            })
            .optional(),
    })
)
