import { err, ok, cacheTableClient, PersistenceError } from '@read-every-word/infrastructure'
import { DeleteReadingRecord, DeleteReadingRecordResult } from '@read-every-word/domain'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async deleteReadingRecord(request: DeleteReadingRecord): Promise<DeleteReadingRecordResult> {
    try {
      const partitionKey = `${request.authId}-${request.readingCycleId}`
      const rowKey = `${request.bookId}-${request.chapterId}`

      await this.tableClient.deleteEntity(partitionKey, rowKey)

      return ok({
        authId: request.authId,
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
