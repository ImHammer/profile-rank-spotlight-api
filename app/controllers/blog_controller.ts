import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateBlogPayload } from '../payloads/blog_payload.js'
import { createBlogValidator } from '#validators/blog'
import Blog from '#models/blog'
import { inject } from '@adonisjs/core'
import { FileService } from '#services/file_service'

const blogPostToken = env.get('BLOG_POST_TOKEN')

@inject()
export default class BlogController {
    constructor(protected fileService: FileService) {}

    async index({ request, response }: HttpContext) {}

    async store({ request, response }: HttpContext) {
        const authToken = request.header('Authorization', '')

        if (authToken != blogPostToken) {
            response.created({})
        }

        const payload: CreateBlogPayload = request.validateUsing({
            title: request.input('title'),
            resumed: request.input('resumed'),
            content: request.input('content'),
            image: request.file('image'),
        })

        const blogModel = Blog.create({
            title: payload.title,
            resumed: payload.resumed,
            content: payload.content,
            image: await this.fileService.getBufferFromMultipartFile(payload.image),
        })
    }
}
