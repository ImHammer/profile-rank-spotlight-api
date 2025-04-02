import crypto from 'crypto'

import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import { profile } from 'console'

export class ProfileService {
    async generateProfileKey(
        identifier: number
    ): Promise<{ key: string; encodedId: string; randomPart: string } | null> {
        try {
            const secret = env.get('SECRET_KEY') // Segredo do backend
            const baseEncodeId = env.get('PK_BASE_ENCODE_ID')
            const randomPartBytesLen = env.get('PK_RANDOM_PART_BYTES_LEN')
            const signatureLen = env.get('PK_SIGN_LEN')

            console.log({ identifier, baseEncodeId, randomPartBytesLen, signatureLen })

            const encodedId = Number(identifier).toString(baseEncodeId) // ID compactado em Base36
            console.log({ encodedId })
            const randomPart = crypto.randomBytes(randomPartBytesLen).toString('hex') // 12 caracteres aleatórios

            // Criamos a assinatura HMAC
            const hmac = crypto.createHmac('sha256', secret)
            hmac.update(encodedId + randomPart)
            const signature = hmac.digest('hex').slice(0, signatureLen) // 8 caracteres da assinatura

            return {
                key: `${encodedId}${randomPart}${signature}`,
                encodedId: encodedId,
                randomPart: randomPart,
            }
        } catch (error: any) {
            logger.error('ERRROR ON GENERATE PROFILE KEY', error)
            return null
        }
    }

    async validateProfileKey(
        profileKey: string
    ): Promise<{ id: number; randomPart: string } | null> {
        try {
            const secret = env.get('SECRET_KEY') // Segredo do backend
            const baseEncodeId = env.get('PK_BASE_ENCODE_ID')
            const randomPartBytesLen = env.get('PK_RANDOM_PART_BYTES_LEN')
            const signatureLen = env.get('PK_SIGN_LEN')

            const lengNoIdPart = randomPartBytesLen * 2 + signatureLen

            // Extrai as partes da chave
            const encodedId = profileKey.slice(0, profileKey.length - lengNoIdPart) // ID Base36
            const randomPart = profileKey.slice(
                profileKey.length - lengNoIdPart,
                profileKey.length - signatureLen
            ) // Random Hex

            const signature = profileKey.slice(profileKey.length - signatureLen) // Assinatura

            // Recalcula a assinatura esperada
            const hmac = crypto.createHmac('sha256', secret)
            hmac.update(encodedId + randomPart)
            const expectedSignature = hmac.digest('hex').slice(0, signatureLen)

            // Verifica se a assinatura é válida
            if (signature !== expectedSignature) {
                return null
            }

            // Retorna o ID decodificado
            return {
                id: parseInt(encodedId, baseEncodeId),
                randomPart: randomPart,
            }
        } catch (error: any) {
            logger.error('ERROR ON VALIDATE PROFILE KEY', error)
            return null
        }
    }
}
