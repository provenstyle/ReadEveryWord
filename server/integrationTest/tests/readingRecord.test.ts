import { withConfig, withUser, withReadingCycle } from './scenarios'
import { Bible } from '../domain/bible'
import { Chapter } from '../domain/chapter'
import { Book } from '../domain/book'
import { chunk } from 'lodash'
import { expectOk } from '@read-every-word/infrastructure'
import { Client, CreateReadingRecord } from '@read-every-word/client'


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

    it('can create a record for every chapter in the bible', async () => {
        const user = await withUser()
        const readingCycle = await withReadingCycle(user)
        const bible = new Bible()
        const date = new Date().toISOString()

        const requests: CreateReadingRecord[] = []

        for(const book of bible.books){
          for(const chapter of book.chapters) {
            requests.push({
              readingCycleId: readingCycle.id,
              bookId: book.id,
              chapterId: chapter.id,
              dateRead: date
            })
          }
        }

        console.log(`Request count: ${requests.length}`)

        const batches = chunk<CreateReadingRecord>(requests, 50)
        for(const batch of batches) {
          const promises = []
          for(const request of batch) {
            promises.push(readingRecordClient.create(request))
          }
          await Promise.all(promises)
        }

        const getReadingRecordResult = await readingRecordClient.get({readingCycleId: readingCycle.id})
        const readingRecords = expectOk(getReadingRecordResult)
        expect(readingRecords.length).toEqual(1189)

    }, 60 * 1000)
})

