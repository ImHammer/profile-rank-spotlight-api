/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  SECRET_KEY: Env.schema.string(),
  MERCADOPAGO_ACCESS_TOKEN: Env.schema.string(),
  PK_RANDOM_PART_BYTES_LEN: Env.schema.number(),
  PK_BASE_ENCODE_ID: Env.schema.number(),
  PK_SIGN_LEN: Env.schema.number(),

  CLIENT_DOMAIN_URL: Env.schema.string(),

  SERVER_DOMAIN_URL: Env.schema.string()
})
