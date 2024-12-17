import { Result, err, ok, cacheTableClient, PersistenceError } from '@read-every-word/infrastructure'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { ReadingRecord, CreateReadingRecord } from '@read-every-word/domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async createReadingRecord(request: CreateReadingRecord): Promise<Result<ReadingRecord, CreateFailed>> {
    try {
      const rowKey = `${request.bookId}-${request.chapterId}`

      await this.tableClient.createEntity({
        partitionKey: request.readingCycleId,
        rowKey,
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
      console.error('Unexpected error creating readingRecord', e)
      return err(new PersistenceError())
    }
  }
}

export type CreateFailed =
  | PersistenceError
