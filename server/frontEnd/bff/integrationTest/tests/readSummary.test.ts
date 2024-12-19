import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/bff'
import { withConfig, withAuthToken } from './scenarios'

describe('readSummary', () => {
    const config= withConfig()

    const client = new Client(config.service, withAuthToken)

    it('return the default reading cycle', async () => {
      const readSummaryResult = await client.readSummary.get()
      const readSummary = expectOk(readSummaryResult)
      expect(readSummary.readingCycles.length).toBeGreaterThan(0)

      const defaultReadingCycle = readSummary.readingCycles.find(x => x.default)
      if (!defaultReadingCycle) { throw new Error('expected default readingCycle')}
    })
})

