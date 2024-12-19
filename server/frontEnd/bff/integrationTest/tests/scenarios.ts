import { expectOk } from '@read-every-word/infrastructure'
import { ReadingCycle } from '@read-every-word/domain'
import { Client, fromEnv } from '@read-every-word/bff'

export function withBaseUrl(): string {
  const baseUrl = process.env.BASE_URL
  if (!baseUrl) {
    throw new Error('Expected BASE_URL environment variable')
  }
  return baseUrl
}

export const withAuthToken = (): Promise<string> => {
  return new Promise<string>((resolve) => {
    const authToken = process.env.AUTH_TOKEN ?? ''
    resolve(authToken)
  })
}

export async function withDefaultReadingCycle(): Promise<ReadingCycle> {
  const client = new Client(withBaseUrl(), withAuthToken)
  const readSummaryResult = await client.readSummary.get()
  const read = expectOk(readSummaryResult)
  const defaultReadingCycle = read.readingCycles.find(x => x.default)
  if (!defaultReadingCycle) throw new Error('Expected default reading cycle')
  return defaultReadingCycle
}
