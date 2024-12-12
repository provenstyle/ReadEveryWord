import { Result, isErr, ok, InvalidConfiguration, ValidationFailed, InvalidSchema } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { Persistence, CreateFailed } from './persistence'
import { fromEnv } from '../../config'
import { ReadingRecord } from '../domain'

export async function handleGetReadingRecord(request: GetReadingRecord): Promise<GetReadingRecordResult> {
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
  const getReadingRecordResponse = await persistence.getReadingRecord(request)
  if (isErr(getReadingRecordResponse)) {
    return getReadingRecordResponse
  }
  const readingRecord = getReadingRecordResponse.data

  return ok(readingRecord)
}

export interface GetReadingRecord {
  readingCycleId: string
}

export type GetReadingRecordSucceeded =
  | ReadingRecord[]

export type GetReadingRecordFailed =
  | InvalidConfiguration
  | ValidationFailed
  | CreateFailed

export type GetReadingRecordResult = Result<GetReadingRecordSucceeded, GetReadingRecordFailed>


