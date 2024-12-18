import { Result, isErr, ok, InvalidConfiguration, ValidationFailed, GetFailed, CreateFailed } from '@read-every-word/infrastructure'
import { ReadingCycle, ReadingRecord } from '@read-every-word/domain'
import { Client, fromEnv} from '@read-every-word/client'
import { validate } from './validation'

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

  const client = new Client(config.service)

  // ReadingCycle
  const readingCycleResult = await client.readingCycle.get({
    authId: request.authId
  })
  if (isErr(readingCycleResult)) {
    return readingCycleResult
  }
  const readingCycles = readingCycleResult.data

  let defaultReadingCycle
  defaultReadingCycle = readingCycles.find(x => x.default)

  if (!defaultReadingCycle) {
    const readingCycleResult = await client.readingCycle.create({
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

  //ReadingRecords
  const readingRecordResult = await client.readingRecord.get({
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

export interface GetSummary {
  authId: string
}

export interface ReadingSummary {
  readingCycles: ReadingCycle[]
  readingRecords: ReadingRecord[]
}

export type GetSummarySucceeded =
  | ReadingSummary

export type GetSummaryFailed =
  | InvalidConfiguration
  | ValidationFailed
  | GetFailed
  | CreateFailed

export type GetSummaryResult = Result<GetSummarySucceeded, GetSummaryFailed>
