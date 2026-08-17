import { err, ok, PersistenceError } from '@read-every-word/foundation'
import { cacheTableClient } from '@read-every-word/table-storage'
import { type DeleteReadingRecord, type DeleteReadingRecordResult } from '@read-every-word/domain'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config.js'
import { type Authenticated } from '../../trpc.js'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async deleteReadingRecord(authenticated: Authenticated<DeleteReadingRecord>): Promise<DeleteReadingRecordResult> {
    const { request, principal } = authenticated
    try {
      const partitionKey = `${principal.authId}-${request.readingCycleId}`
      const rowKey = `${request.bookId}-${request.chapterId}`

      await this.tableClient.deleteEntity(partitionKey, rowKey)

      return ok({
        readingCycleId: request.readingCycleId,
        id: rowKey,
        deleted: true
      })
    } catch (e) {
      console.error('Unexpected error deleting readingRecord', e)
      return err(new PersistenceError())
    }
  }
}
