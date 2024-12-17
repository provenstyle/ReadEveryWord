import { withConfig, withUser, withReadingCycle, withReadingRecord } from './scenarios'
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

    it('can delete reading record', async () => {
        const user = await withUser()
        const readingCycle = await withReadingCycle(user)
        const readingRecord = await withReadingRecord(readingCycle)

        let getReadingRecordsResult
        let readingRecords
        getReadingRecordsResult = await readingRecordClient.get({
          readingCycleId: readingCycle.id
        })
        readingRecords = expectOk(getReadingRecordsResult)
        expect(readingRecords.length).toBe(1)

        const deleteResult = await readingRecordClient.delete({
          readingCycleId: readingCycle.id,
          bookId: readingRecord.bookId,
          chapterId: readingRecord.chapterId
        })
        const deleteReadingRecord = expectOk(deleteResult)

        getReadingRecordsResult = await readingRecordClient.get({
          readingCycleId: readingCycle.id
        })
        readingRecords = expectOk(getReadingRecordsResult)
        expect(readingRecords.length).toBe(0)
    }, 10 * 1000)
})

