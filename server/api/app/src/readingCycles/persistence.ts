import { Result, err, ok, cacheTableClient, PersistenceError, isErr, GetFailed, UpdateFailed, NotFound, resourceDoesNotExist, withLock } from '@read-every-word/infrastructure'
import { ReadingCycle, GetReadingCycle, CreateReadingCycle, CreateReadingCycleResult, SetDefaultReadingCycle, UpdateReadingCycle } from '@read-every-word/domain'
import { TableClient, TableTransaction } from '@azure/data-tables'
import { Config } from '../config'
import { ReadingCycleRow, map } from './domain'
import { v4 as uuid } from 'uuid'
import { chunk } from 'lodash'

const LOCK_TIME_OUT = 30 * 1000 // 30 seconds

export class Persistence {
  private tableClient: TableClient
  private config: Config

  constructor (config: Config) {
      this.config = config
      this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingCycle')
  }

  async createReadingCycle(request: CreateReadingCycle): Promise<CreateReadingCycleResult> {
    try {
      return await withLock({
        storageConnectionString: this.config.tableStorageConnectionString,
        containerName: request.authId,
        lockFileName: 'readingCycle_create.lock',
        wait: LOCK_TIME_OUT,
        func: async () => {
          const getAllReadingCyclesResult = await this.getAllReadingCycles({authId: request.authId})
          if (isErr(getAllReadingCyclesResult)) {
            return getAllReadingCyclesResult
          }
          const allReadingCycles = getAllReadingCyclesResult.data

          const readingCycle = {
            partitionKey: request.authId,
            rowKey: uuid(),
            name: request.name,
            dateStarted: request.dateStarted,
            default: (allReadingCycles.length === 0)
              ? true
              : false
          }

          await this.tableClient.createEntity(readingCycle)

          return ok({
            authId: request.authId,
            id: readingCycle.rowKey,
            lastModified: '',
            name: readingCycle.name,
            dateStarted: readingCycle.dateStarted,
            default: readingCycle.default
          })
        }
      })
    } catch (e) {
      if (resourceDoesNotExist(e)) {
        return err(new NotFound())
      }
      console.error('Unexpected error creating readingCycle', e)
      return err(new PersistenceError())
    }
  }

  async getAllReadingCycles(request: GetReadingCycle): Promise<Result<ReadingCycle[], GetFailed>> {
    try {
      const allRows: ReadingCycleRow[] = []
      const allRowsResult = this.tableClient.listEntities<ReadingCycleRow>({
        queryOptions: {
          filter: `PartitionKey eq '${request.authId}'`
        }
      })
      for await (const row of allRowsResult) {
        allRows.push(row)
      }
      return ok(allRows.map(u => map(u)))
    } catch (e) {
      if (resourceDoesNotExist(e)) {
        return ok([])
      }
      console.error('Unexpected error creating readingCycle', e)
      return err(new PersistenceError())
    }
  }

  async setDefaultReadingCycle(request: SetDefaultReadingCycle): Promise<Result<ReadingCycle, UpdateFailed>> {
    try {
      // get rows
      const allRows: ReadingCycleRow[] = []
      const allRowsResult = this.tableClient.listEntities<ReadingCycleRow>({
        queryOptions: {
          filter: `PartitionKey eq '${request.authId}'`
        }
      })

      // update rows
      const transaction = new TableTransaction()
      let readingCycle: ReadingCycleRow | undefined = undefined
      for await (const row of allRowsResult) {
        if (row.rowKey === request.id) {
          row.default = true
          readingCycle = row
        } else {
          row.default = false
        }
        transaction.updateEntity(row)
      }

      if (!readingCycle) {
        return err(new NotFound())
      }

      const batches = chunk(transaction.actions, 100)
      for (const batch of batches) {
        await this.tableClient.submitTransaction(batch)
      }

      return ok(map(readingCycle))
    } catch (e) {
      if (resourceDoesNotExist(e)) {
        return err(new NotFound())
      }
      console.error('Unexpected error creating readingCycle', e)
      return err(new PersistenceError())
    }
  }

  async updateReadingCycle(request: UpdateReadingCycle): Promise<Result<ReadingCycle, UpdateFailed>> {
    try {
      const readingCycleRow = await this.tableClient
        .getEntity<ReadingCycleRow>(request.authId, request.id)

      if (!readingCycleRow) {
        return err(new NotFound())
      }

      if (request.name) {
        readingCycleRow.name = request.name
      }

      if (request.dateCompleted) {
        readingCycleRow.dateCompleted = request.dateCompleted
      }

      await this.tableClient.updateEntity<ReadingCycleRow>(readingCycleRow)

      return ok(map(readingCycleRow))

    } catch (e) {
      if (resourceDoesNotExist(e)) {
        return err(new NotFound())
      }
      console.error('Unexpected error creating readingCycle', e)
      return err(new PersistenceError())
    }
  }

}
