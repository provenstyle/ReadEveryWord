import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/bff'
import { withConfig, withAuthToken, withDefaultReadingCycle } from './scenarios'

describe('readingRecord', () => {
    const config= withConfig()
    const client = new Client(config.service, withAuthToken)

    it('can create readingRecord', async () => {
      const defaultReadingCycle = await withDefaultReadingCycle()
      const readingRecordResult = await client.readingRecord.create({
        readingCycleId: defaultReadingCycle.id,
        bookId: 0,
        chapterId: 0,
        dateRead: new Date().toISOString(),
      })
      expectOk(readingRecordResult)
    })
})

