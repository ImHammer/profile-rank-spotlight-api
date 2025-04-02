import { Exception } from '@adonisjs/core/exceptions'

export default class InvalidPayloadErrorException extends Exception {
  static status = 500
}