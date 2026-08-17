import { isErr, ok } from '@read-every-word/foundation'
import { type CreateReadingRecord, type CreateReadingRecordResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from './persistence.js'
import { authenticatedMutation, type Authenticated } from '../../trpc.js'
import { Config } from '../../config.js'

export const createReadingRecordProcedure = authenticatedMutation(handleCreateReadingRecord)

export async function handleCreateReadingRecord (
  authenticated: Authenticated<CreateReadingRecord>,
  config: Config
): Promise<CreateReadingRecordResult> {
  const validationResponse = await validate(authenticated.request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const createReadingRecordResponse = await persistence.createReadingRecord(authenticated)
  if (isErr(createReadingRecordResponse)) {
    return createReadingRecordResponse
  }
  const readingRecord = createReadingRecordResponse.data

  return ok(readingRecord)
}
