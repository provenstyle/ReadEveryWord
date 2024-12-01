import { withConfig, withUser, withReadingCycle } from './scenarios'
import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/client'

describe('readingRecord', () => {
    const config= withConfig()

    const readingRecordClient = new Client(config.service).readingRecord

    it('can create and get a reading record', async () => {
        const user = await withUser()
        const readingCycle = await withReadingCycle(user)

        // create
        const readingRecordResult = await readingRecordClient.create({
          readingCycleId: readingCycle.id,
          bookId: 0,
          chapterId: 0,
          dateRead: new Date().toISOString()
        })
        expectOk(readingRecordResult)

        // get
        const getReadingRecordsResult = await readingRecordClient.get({
          readingCycleId: readingCycle.id
        })
        const readingRecords = expectOk(getReadingRecordsResult)

        expect(readingRecords.length).toBe(1)
        const readingRecord = readingRecords[0]
        expect(readingRecord.bookId).toBe(0)
        expect(readingRecord.chapterId).toBe(0)
        expect(readingRecord.readingCycleId).toBe(readingCycle.id)
        expect(readingRecord.dateRead).toBeDefined()
    }, 10 * 1000)
})

