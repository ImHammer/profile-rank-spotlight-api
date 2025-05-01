import vine from '@vinejs/vine'

export const createBlogValidator = vine.compile(
    vine.object({
        title: vine.string().maxLength(255),
        resumed: vine.string().maxLength(500),
        content: vine.string().optional(),
        image: vine
            .file({
                size: '2mb',
                extnames: ['jpg', 'png', 'jpeg'],
            })
            .optional(),
    })
)
