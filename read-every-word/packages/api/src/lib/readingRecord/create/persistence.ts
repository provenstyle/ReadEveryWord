import { Result, err, ok, PersistenceError } from '@read-every-word/foundation'
import { cacheTableClient, entityAlreadyExist } from '@read-every-word/table-storage'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config.js'
import { ReadingRecord, CreateReadingRecord } from '@read-every-word/domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async createReadingRecord(request: CreateReadingRecord): Promise<Result<ReadingRecord, CreateFailed>> {
    const partitionKey = `${request.authId}-${request.readingCycleId}`
    const rowKey = `${request.bookId}-${request.chapterId}`

    try {
      await this.tableClient.createEntity({
        partitionKey,
        rowKey,
        authId: request.authId,
        readingCycleId: request.readingCycleId,
        dateRead: request.dateRead,
        bookId: request.bookId,
        chapterId: request.chapterId
      })

      return ok({
        authId: request.authId,
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
          authId: request.authId,
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
