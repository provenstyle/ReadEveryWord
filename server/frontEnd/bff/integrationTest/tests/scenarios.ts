// import { v4 as uuid } from 'uuid'
import { expectOk } from '@read-every-word/infrastructure'
import { ReadingCycle } from '@read-every-word/domain'
import { Client, Config, fromEnv } from '@read-every-word/bff'

export function withConfig(): Config {
  const configResult = fromEnv()
  return expectOk(configResult)
}

export const withAuthToken = (): Promise<string> => {
  return new Promise<string>((resolve) => {
    const authToken = process.env.AUTH_TOKEN ?? ''
    resolve(authToken)
  })
}

export async function withDefaultReadingCycle(): Promise<ReadingCycle> {
  const config = withConfig()
  const client = new Client(config.service, withAuthToken)
  const readSummaryResult = await client.readSummary.get()
  const read = expectOk(readSummaryResult)
  const defaultReadingCycle = read.readingCycles.find(x => x.default)
  if (!defaultReadingCycle) throw new Error('Expected default reading cycle')
  return defaultReadingCycle
}
