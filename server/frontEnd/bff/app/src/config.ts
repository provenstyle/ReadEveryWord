import { err, ok, type Result } from '@read-every-word/infrastructure'

export interface OpenIdConfig {
  jwksUri: string
  audience: string
  issuer: string
}

export interface Config {
  tableStorageConnectionString: string
  openId: OpenIdConfig
}

export function fromEnv (): Result<Config, InvalidConfiguration> {
  const vars: Record<string, string> = {}

  const requiredEnvVariables = [
    'TABLE_STORAGE_CONNECTION_STRING',
    'JWKS_URI',
    'AUDIENCE',
    'ISSUER'
  ]

  for (const name of requiredEnvVariables) {
    const envVariable = process.env[name]
    if (!envVariable) {
      console.log(`Invalid Configuration. Required environment variable: ${name}`)
      return err(new InvalidConfiguration())
    }
    vars[name] = envVariable
  }

  return ok({
    tableStorageConnectionString: vars.TABLE_STORAGE_CONNECTION_STRING,
    openId: {
      jwksUri: vars.JWKS_URI,
      audience: vars.AUDIENCE,
      issuer: vars.ISSUER
    }
  })
}

export class InvalidConfiguration {
    code = 'invalid-server-configuration' as const
    message = 'Unexpected server error'
}