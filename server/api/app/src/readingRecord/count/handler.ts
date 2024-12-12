import { Result, isErr, ok, InvalidConfiguration, ValidationFailed, InvalidSchema } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { Persistence, CreateFailed } from './persistence'
import { fromEnv } from '../../config'

export async function handleCountReadingRecord(request: CountReadingRecord): Promise<CountReadingRecordResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data

  const validationResponse = await validate(request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const countReadingRecordResponse = await persistence.countReadingRecords(request)
  if (isErr(countReadingRecordResponse)) {
    return countReadingRecordResponse
  }

  return ok(countReadingRecordResponse.data)
}

export interface CountReadingRecord {
  readingCycleId: string
}

export type CountReadingRecordSucceeded =
  | number

export type CountReadingRecordFailed =
  | InvalidConfiguration
  | ValidationFailed
  | CreateFailed

export type CountReadingRecordResult = Result<CountReadingRecordSucceeded, CountReadingRecordFailed>


