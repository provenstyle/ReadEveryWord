import { Result, isErr, ok } from '../../../infrastructure/Result'
import { ValidationFailed, InvalidSchema } from '../../../infrastructure/Validation'
import { validate } from './validation'
import { fromEnv, type InvalidConfiguration } from '../../../config'
import { ReadingCycle, Summary} from '../domain'
import { handleGetUser, type GetUserFailed } from '../../../users/get/handler'
import { handleGetReadingCycle, type GetReadingCycleFailed } from '../../../readingCycles/get/handler'
import { handleCreateReadingCycle, type CreateReadingCycleFailed } from '../../../readingCycles/create/handler'
import { handleGetReadingRecord, type GetReadingRecordFailed } from '../../../readingRecord/get/handler'

export async function handleGetSummary(request: GetSummary): Promise<GetSummaryResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data

  const validationResponse = await validate(request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  // User
  const getUserResult = await handleGetUser({
    authId: request.authId
  })
  if(isErr(getUserResult)) {
    return getUserResult
  }
  const user = getUserResult.data

  // ReadingCycle
  const readingCycleResult = await getCurrentReadingCycle(request)
  if (isErr(readingCycleResult)) {
    return readingCycleResult
  }
  const readingCycle = readingCycleResult.data

  console.log(readingCycle)

  //ReadingRecords
  const readingRecordResult = await handleGetReadingRecord({
    readingCycleId: readingCycle.id
  })
  if (isErr(readingRecordResult)) {
    return readingRecordResult
  }
  const readingRecords = readingRecordResult.data

  const summary: Summary = {
    user: {
      email: user.email
    },
    readingCycle: {
      id: readingCycle.id,
      dateStarted: readingCycle.dateStarted
    },
    readingRecords: readingRecords.map(x => ({
      bookId: x.bookId,
      chapterId: x.chapterId
    }))
  }

  return ok(summary)
}

export interface GetSummary {
  authId: string
}

export type GetSummarySucceeded =
  | Summary

export type GetSummaryFailed =
  | InvalidConfiguration
  | ValidationFailed<InvalidSchema>
  | GetUserFailed
  | GetReadingCycleFailed
  | CreateReadingCycleFailed
  | GetReadingRecordFailed

export type GetSummaryResult = Result<GetSummarySucceeded, GetSummaryFailed>

async function getCurrentReadingCycle(request: GetSummary): Promise<Result<ReadingCycle, GetSummaryFailed>> {
  const getReadingCycleResult = await handleGetReadingCycle({
    authId: request.authId
  })
  if (isErr(getReadingCycleResult)) {
    return getReadingCycleResult
  }
  const readingCycles = getReadingCycleResult.data

  let currentReadingCycle: ReadingCycle | undefined

  // pick the first readingCycle that has not been completed
  if (readingCycles.length > 0) {
    currentReadingCycle = readingCycles.find(x => (!x.dateCompleted))
  }

  //create a new ReadingCycle since none was found
  if (!currentReadingCycle) {
    const createReadingCycleResult = await handleCreateReadingCycle({
      authId: request.authId,
      dateStarted: new Date().toISOString()
    })
    if (isErr(createReadingCycleResult)) {
      return createReadingCycleResult
    }
    currentReadingCycle = createReadingCycleResult.data
  }

  return ok(currentReadingCycle)
}
