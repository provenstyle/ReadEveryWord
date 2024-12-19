import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/bff'
import { withBaseUrl, withAuthToken, withDefaultReadingCycle } from './scenarios'

describe('readingRecord', () => {
    const client = new Client(withBaseUrl(), withAuthToken)

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

