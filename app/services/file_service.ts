import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'fs/promises'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import logger from '@adonisjs/core/services/logger'

export class FileService {
    getBufferFromMultipartFile(file: MultipartFile): Promise<Buffer | null> {
        return new Promise((resolve, reject) => {
            const imageName = cuid()
            const tempUploadPath = app.tmpPath(`uploads`)

            file.move(tempUploadPath, {
                name: imageName,
                overwrite: true,
            })
                .then(() => {
                    return fs.readFile(tempUploadPath + '/' + imageName)
                })
                .then((fileBuffer) => {
                    resolve(fileBuffer)
                })
                .catch((error) => {
                    logger.error('ERRROR ON GET FILE BUFFER', error)
                    reject(error)
                })
                .finally(() => {
                    return fs.unlink(tempUploadPath + '/' + imageName)
                })
        })
    }
}
