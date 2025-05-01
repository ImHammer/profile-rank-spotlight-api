import { MultipartFile } from '@adonisjs/core/bodyparser'

export interface CreateBlogPayload {
    title: string
    resumed: string
    content: string
    image: MultipartFile
}
