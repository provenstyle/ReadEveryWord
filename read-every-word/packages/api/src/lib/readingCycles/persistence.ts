import { Result, err, ok, PersistenceError, isErr, GetFailed, UpdateFailed, NotFound } from '@read-every-word/foundation'
import { cacheTableClient, resourceDoesNotExist, withLock } from '@read-every-word/table-storage'
import { TableClient, TableTransaction, type UpdateMode } from '@azure/data-tables'
import { Config } from '../config.js'
import { type ReadingCycleRow, map } from './domain.js'
import { v4 as uuid } from 'uuid'
import { chunk } from 'lodash-es'
import { type ReadingCycle, type CreateReadingCycle, type CreateReadingCycleResult, type SetDefaultReadingCycle, type UpdateReadingCycle } from '@read-every-word/domain'
import { type Authenticated, type Principal } from '../trpc.js'

const LOCK_TIME_OUT = 30 * 1000 // 30 seconds

export class Persistence {
  private tableClient: TableClient
  private config: Config

  constructor (config: Config) {
      this.config = config
      this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingCycle')
  }

  async createReadingCycle(authenticated: Authenticated<CreateReadingCycle>): Promise<CreateReadingCycleResult> {
    const { request, principal } = authenticated
    try {
      return await withLock({
        storageConnectionString: this.config.tableStorageConnectionString,
        containerName: principal.authId,
        lockFileName: 'readingCycle_create.lock',
        wait: LOCK_TIME_OUT,
        func: async () => {
          const getAllReadingCyclesResult = await this.getAllReadingCycles(principal)
          if (isErr(getAllReadingCyclesResult)) {
            return getAllReadingCyclesResult
          }
          const allReadingCycles = getAllReadingCyclesResult.data

          const readingCycle = {
            partitionKey: principal.authId,
            rowKey: uuid(),
            name: request.name,
            dateStarted: request.dateStarted,
            default: (allReadingCycles.length === 0)
              ? true
              : false
          }

          await this.tableClient.createEntity(readingCycle)

          return ok({
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

  async getAllReadingCycles(principal: Principal): Promise<Result<ReadingCycle[], GetFailed>> {
    try {
      const allRows: ReadingCycleRow[] = []
      const allRowsResult = this.tableClient.listEntities<ReadingCycleRow>({
        queryOptions: {
          filter: `PartitionKey eq '${principal.authId}'`
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
      console.error('Unexpected error getting all readingCycles', e)
      return err(new PersistenceError())
    }
  }

  async setDefaultReadingCycle(authenticated: Authenticated<SetDefaultReadingCycle>): Promise<Result<ReadingCycle, UpdateFailed>> {
    const { request, principal } = authenticated
    try {
      // get rows
      const allRowsResult = this.tableClient.listEntities<ReadingCycleRow>({
        queryOptions: {
          filter: `PartitionKey eq '${principal.authId}'`
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
      console.error('Unexpected error setting default readingCycle', e)
      return err(new PersistenceError())
    }
  }

  async updateReadingCycle(authenticated: Authenticated<UpdateReadingCycle>): Promise<Result<ReadingCycle, UpdateFailed>> {
    const { request, principal } = authenticated
    try {
      const readingCycleRow = await this.tableClient
        .getEntity<ReadingCycleRow>(principal.authId, request.id)

      if (!readingCycleRow) {
        return err(new NotFound())
      }

      if (request.name) {
        readingCycleRow.name = request.name
      }

      // Merge only writes the properties it is given, so it can set dateCompleted but
      // never remove it. Clearing one -- reopening a completed cycle -- needs Replace,
      // which drops whatever the entity does not carry. Safe here because the row was
      // just read in full, so nothing else is lost.
      let mode: UpdateMode = 'Merge'

      if (request.dateCompleted !== undefined) {
        if (request.dateCompleted === null) {
          delete readingCycleRow.dateCompleted
          mode = 'Replace'
        } else {
          readingCycleRow.dateCompleted = request.dateCompleted
        }
      }

      await this.tableClient.updateEntity<ReadingCycleRow>(readingCycleRow, mode)

      return ok(map(readingCycleRow))

    } catch (e) {
      if (resourceDoesNotExist(e)) {
        return err(new NotFound())
      }
      console.error('Unexpected error updating readingCycle', e)
      return err(new PersistenceError())
    }
  }

}
