import { Caller } from '@read-every-word/api'
import { withCaller, withUser, withReadingCycle, withReadingRecord } from './scenarios.js'
import { expectOk } from '@read-every-word/foundation'

describe('readingRecord', () => {

    let caller: Caller

    beforeEach(async () => {
      caller = await withCaller()
    })

    it('can create and get a reading record', async () => {
        const user = await withUser()
        const readingCycle = await withReadingCycle(user)

        // create
        const readingRecordResult = await caller.readingRecord.create({
          authId: user.authId,
          readingCycleId: readingCycle.id,
          bookId: 0,
          chapterId: 0,
          dateRead: new Date().toISOString()
        })
        expectOk(readingRecordResult)

        // get
        const getReadingRecordsResult = await caller.readingRecord.get({
          authId: user.authId,
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
        const readingRecord = await withReadingRecord(user, readingCycle)

        let getReadingRecordsResult
        let readingRecords
        getReadingRecordsResult = await caller.readingRecord.get({
          authId: user.authId,
          readingCycleId: readingCycle.id
        })
        readingRecords = expectOk(getReadingRecordsResult)
        expect(readingRecords.length).toBe(1)

        const deleteResult = await caller.readingRecord.delete({
          authId: user.authId,
          readingCycleId: readingCycle.id,
          bookId: readingRecord.bookId,
          chapterId: readingRecord.chapterId
        })
        expectOk(deleteResult)

        getReadingRecordsResult = await caller.readingRecord.get({
          authId: user.authId,
          readingCycleId: readingCycle.id
        })
        readingRecords = expectOk(getReadingRecordsResult)
        expect(readingRecords.length).toBe(0)
    }, 10 * 1000)
})

