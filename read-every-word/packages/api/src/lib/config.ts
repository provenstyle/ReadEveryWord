import { err, ok, type Result, InvalidConfiguration } from '@read-every-word/foundation'

// Everything needed to verify a token, and nothing else. Authentication takes
// this rather than the whole OpenIdConfig so that adding browser facing
// settings below never widens what the verification path can reach.
export interface TokenVerificationConfig {
  jwksUri: string
  audience: string
  issuer: string
}

export interface OpenIdConfig extends TokenVerificationConfig {
  // Not used to verify anything. These exist only to be handed to the browser
  // by clientConfig.get, so the SPA can configure its Auth0 client before it
  // has a token.
  domain: string
  clientId: string
}

export interface Config {
 tableStorageConnectionString: string
  openId: OpenIdConfig
}

export function fromEnv (): Result<Config, InvalidConfiguration> {
  const vars: Record<string, string> = {}

  const requiredEnvVariables = [
    'TABLE_STORAGE_CONNECTION_STRING',
    'OPEN_ID_JWKS_URI',
    'OPEN_ID_AUDIENCE',
    'OPEN_ID_ISSUER',
    'OPEN_ID_DOMAIN',
    'OPEN_ID_CLIENT_ID'
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
      issuer: vars.OPEN_ID_ISSUER,
      domain: vars.OPEN_ID_DOMAIN,
      clientId: vars.OPEN_ID_CLIENT_ID
    }
  })
}
