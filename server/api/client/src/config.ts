import { Result, ok, err, InvalidConfiguration} from '@read-every-word/infrastructure'
import * as dotenv from 'dotenv'
dotenv.config()

export interface ServiceConfig {
  baseUrl: string
  subscriptionKey: string
}

export interface Config {
  service: ServiceConfig
}

export function fromEnv (): Result<Config, InvalidConfiguration> {
  const vars: Record<string, string> = {}

  const requiredEnvVariables = [
    'BASE_URL',
    'SUBSCRIPTION_KEY'
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
    service: {
      baseUrl: vars.BASE_URL,
      subscriptionKey: vars.SUBSCRIPTION_KEY
    }
  })
}
