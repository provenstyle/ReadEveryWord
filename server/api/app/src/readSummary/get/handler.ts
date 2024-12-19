import { isErr, ok, err, withLock, NotFound } from '@read-every-word/infrastructure'
import {
  GetReadSummary,
  GetReadSummaryResult,
  ReadingCycle,
  GetReadingCycleFailed,
  CreateReadingCycleFailed
} from '@read-every-word/domain'
import { validate } from './validation'
import { fromEnv } from '../../config'
import { handleGetReadingCycle } from '../../readingCycles/getAll/handler'
import { handleCreateReadingCycle } from '../../readingCycles/create/handler'
import { handleGetReadingRecord } from '../../readingRecord/get/handler'

const LOCK_TIME_OUT = 30 * 1000 // 30 seconds

export async function handleGetReadSummary(request: GetReadSummary): Promise<GetReadSummaryResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data

  const validationResponse = await validate(request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  // ReadingCycle
  // Without a lock multiple default reading cycles can get created if the requests are sent at the same time
  //const readingCycleResult =  await withLock<ReadingCycle[], GetReadingCycleFailed | CreateReadingCycleFailed>({
  const readingCycleResult =  await withLock({
    storageConnectionString: config.tableStorageConnectionString,
    containerName: request.authId,
    lockFileName: 'readSummary_get_read_cycle.lock',
    wait: LOCK_TIME_OUT,
    func: async () => {
      const readingCycleResult = await handleGetReadingCycle({
        authId: request.authId
      })
      if (isErr(readingCycleResult)) {
        return readingCycleResult
      }
      const readingCycles = readingCycleResult.data

      let defaultReadingCycle
      defaultReadingCycle = readingCycles.find(x => x.default)

      if (!defaultReadingCycle) {
        const readingCycleResult = await handleCreateReadingCycle({
          authId: request.authId,
          dateStarted: new Date().toISOString(),
          name: 'First Time Through'
        })
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
    authId: request.authId,
    readingCycleId: defaultReadingCycle.id
  })
  if (isErr(readingRecordResult)) {
    return readingRecordResult
  }
  const readingRecords = readingRecordResult.data

  return ok({
    readingCycles,
    readingRecords
  })
}
