import { isErr, ok, err, NotFound } from '@read-every-word/foundation'
import { withLock } from '@read-every-word/table-storage'
import { GetReadSummaryResult } from '@read-every-word/domain'
import { handleGetReadingCycles } from '../../readingCycles/getAll/handler.js'
import { handleCreateReadingCycle } from '../../readingCycles/create/handler.js'
import { handleGetReadingRecord } from '../../readingRecord/get/handler.js'
import { principalMutation, type Principal } from '../../trpc.js'
import { Config } from '../../config.js'

const LOCK_TIME_OUT = 30 * 1000 // 30 seconds

export const getReadSummaryProcedure = principalMutation(handleGetReadSummary)

// No request to validate: the caller's identity is the whole input.
export async function handleGetReadSummary(principal: Principal, config: Config): Promise<GetReadSummaryResult> {
  // ReadingCycle
  // Without a lock multiple default reading cycles can get created if the requests are sent at the same time
  //const readingCycleResult =  await withLock<ReadingCycle[], GetReadingCycleFailed | CreateReadingCycleFailed>({
  const readingCycleResult =  await withLock({
    storageConnectionString: config.tableStorageConnectionString,
    containerName: principal.authId,
    lockFileName: 'readSummary_get_read_cycle.lock',
    wait: LOCK_TIME_OUT,
    func: async () => {
      const readingCycleResult = await handleGetReadingCycles(principal, config)
      if (isErr(readingCycleResult)) {
        return readingCycleResult
      }
      const readingCycles = readingCycleResult.data

      let defaultReadingCycle
      defaultReadingCycle = readingCycles.find(x => x.default)

      if (!defaultReadingCycle) {
        const readingCycleResult = await handleCreateReadingCycle({
          request: {
            dateStarted: new Date().toISOString(),
            name: 'First Time Through'
          },
          principal
        }, config)
        if (isErr(readingCycleResult)){
          return readingCycleResult
        }
        defaultReadingCycle = readingCycleResult.data
        readingCycles.push(defaultReadingCycle)
      }

      return ok(readingCycles)
    }
  })
  if (isErr(readingCycleResult)) {
    return readingCycleResult
  }

  const readingCycles = readingCycleResult.data
  const defaultReadingCycle = readingCycles.find(x => x.default)
  if (!defaultReadingCycle) {
    return err(new NotFound('defaultReadingCycle'))
  }

  //ReadingRecords
  const readingRecordResult = await handleGetReadingRecord({
    request: { readingCycleId: defaultReadingCycle.id },
    principal
  }, config)
  if (isErr(readingRecordResult)) {
    return readingRecordResult
  }
  const readingRecords = readingRecordResult.data

  return ok({
    readingCycles,
    readingRecords
  })
}
