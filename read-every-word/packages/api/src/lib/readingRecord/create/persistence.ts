import { Result, err, ok, PersistenceError } from '@read-every-word/foundation'
import { cacheTableClient, entityAlreadyExist } from '@read-every-word/table-storage'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config.js'
import { ReadingRecord, CreateReadingRecord } from '@read-every-word/domain'
import { type Authenticated } from '../../trpc.js'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async createReadingRecord(authenticated: Authenticated<CreateReadingRecord>): Promise<Result<ReadingRecord, CreateFailed>> {
    const { request, principal } = authenticated
    const partitionKey = `${principal.authId}-${request.readingCycleId}`
    const rowKey = `${request.bookId}-${request.chapterId}`

    try {
      await this.tableClient.createEntity({
        partitionKey,
        rowKey,
        authId: principal.authId,
        readingCycleId: request.readingCycleId,
        dateRead: request.dateRead,
        bookId: request.bookId,
        chapterId: request.chapterId
      })

      return ok({
        readingCycleId: request.readingCycleId,
        id: rowKey,
        lastModified: '',
        dateRead: request.dateRead,
        bookId: request.bookId,
        chapterId: request.chapterId
      })
    } catch (e) {
      if (entityAlreadyExist(e)) {
        return ok({
          readingCycleId: request.readingCycleId,
          id: rowKey,
          lastModified: '',
          dateRead: request.dateRead,
          bookId: request.bookId,
          chapterId: request.chapterId
        })
      }
      console.error('Unexpected error creating readingRecord', e)
      return err(new PersistenceError())
    }
  }
}

export type CreateFailed =
  | PersistenceError
