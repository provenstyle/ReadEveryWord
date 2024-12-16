import { err, ok, type Result, InvalidConfiguration } from '@read-every-word/infrastructure'

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
    'OPEN_ID_JWKS_URI',
    'OPEN_ID_AUDIENCE',
    'OPEN_ID_ISSUER'
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
      jwksUri: vars.OPEN_ID_JWKS_URI,
      audience: vars.OPEN_ID_AUDIENCE,
      issuer: vars.OPEN_ID_ISSUER
    }
  })
}
