import { Result, isErr, ok, InvalidConfiguration, ValidationFailed, InvalidSchema } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { Persistence, CreateFailed } from './persistence'
import { fromEnv } from '../../config'
import { ReadingRecord } from '../domain'

export async function handleCreateReadingRecord(request: CreateReadingRecord): Promise<CreateReadingRecordResult> {
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
  const createReadingRecordResponse = await persistence.createReadingRecord(request)
  if (isErr(createReadingRecordResponse)) {
    return createReadingRecordResponse
  }
  const readingRecord = createReadingRecordResponse.data

  return ok(readingRecord)
}

export interface CreateReadingRecord {
  readingCycleId: string
  dateRead: string
  bookId: number
  chapterId: number
}

export type CreateReadingRecordSucceeded =
  | ReadingRecord

export type CreateReadingRecordFailed =
  | InvalidConfiguration
  | ValidationFailed
  | CreateFailed

export type CreateReadingRecordResult = Result<CreateReadingRecordSucceeded, CreateReadingRecordFailed>


