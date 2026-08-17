import { isErr, ok } from '@read-every-word/foundation'
import { type DeleteReadingRecord, type DeleteReadingRecordResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from './persistence.js'
import { authenticatedMutation, type Authenticated } from '../../trpc.js'
import { Config } from '../../config.js'

export const deleteReadingRecordProcedure = authenticatedMutation(handleDeleteReadingRecord)

export async function handleDeleteReadingRecord (
  authenticated: Authenticated<DeleteReadingRecord>,
  config: Config
): Promise<DeleteReadingRecordResult> {
  const validationResponse = await validate(authenticated.request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const deleteReadingRecordResponse = await persistence.deleteReadingRecord(authenticated)
  if (isErr(deleteReadingRecordResponse)) {
    return deleteReadingRecordResponse
  }
  const readingRecord = deleteReadingRecordResponse.data

  return ok(readingRecord)
}
