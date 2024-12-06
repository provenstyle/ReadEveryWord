import { err, ok, type Result, InvalidConfiguration } from '@read-every-word/infrastructure'

export interface Config {
    tableStorageConnectionString: string
}

export function fromEnv (): Result<Config, InvalidConfiguration> {
  const vars: Record<string, string> = {}

  const requiredEnvVariables = [
    'TABLE_STORAGE_CONNECTION_STRING'
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
    tableStorageConnectionString: vars.TABLE_STORAGE_CONNECTION_STRING
  })
}
