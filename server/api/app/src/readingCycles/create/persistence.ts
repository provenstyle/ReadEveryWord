import { Result, err, ok, cacheTableClient, PersistenceError } from '@read-every-word/infrastructure'
import { TableClient, TableTransaction, TransactionAction } from '@azure/data-tables'
import { Config } from '../../config'
import { CreateReadingCycle } from './handler'
import { v4 as uuid } from 'uuid'
import { ReadingCycle, ReadingCycleRow } from '../domain'
import { chunk } from 'lodash'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
      this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingCycle')
  }

  async createReadingCycle(request: CreateReadingCycle): Promise<Result<ReadingCycle, CreateFailed>> {
    try {
      // Get all rows
      const allRows: ReadingCycleRow[] = []
      const allRowsResult = this.tableClient.listEntities<ReadingCycleRow>({
        queryOptions: {
          filter: `PartitionKey eq '${request.authId}'`
        }
      })
      for await (const row of allRowsResult) {
        allRows.push(row)
      }
      const transaction = new TableTransaction()
      const rowKey = uuid()

      if (allRows.length === 0) {
        transaction.createEntity({
          partitionKey: request.authId,
          rowKey,
          dateStarted: request.dateStarted,
          dateCompleted: request.dateCompleted,
          default: true
        })
      } else {
        if (!request.default) {
          transaction.createEntity({
            partitionKey: request.authId,
            rowKey,
            dateStarted: request.dateStarted,
            dateCompleted: request.dateCompleted,
            default: false
          })
        } else {
          for (const row of allRows) {
            transaction.updateEntity({
              ...row,
              default: false
            })
          }
          transaction.createEntity({
            partitionKey: request.authId,
            rowKey,
            dateStarted: request.dateStarted,
            dateCompleted: request.dateCompleted,
            default: true
          })
        }
      }

      const batches = chunk<TransactionAction>(transaction.actions, 100)
      for (const batch of batches) {
        await this.tableClient.submitTransaction(batch)
      }

      const createdReadingCycle = await this.tableClient.getEntity<ReadingCycleRow>(request.authId, rowKey)

      return ok({
        id: rowKey,
        lastModified: createdReadingCycle.timestamp,
        authId: request.authId,
        dateStarted: createdReadingCycle.dateStarted,
        dateCompleted: createdReadingCycle.dateCompleted,
        default: createdReadingCycle.default
      })
    } catch (e) {
      console.error('Unexpected error creating readingCycle', e)
      return err(new PersistenceError())
    }
  }
}

export type CreateFailed =
  | PersistenceError
