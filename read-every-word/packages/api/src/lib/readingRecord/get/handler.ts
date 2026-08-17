import { isErr, ok } from '@read-every-word/foundation'
import { type GetReadingRecord, type GetReadingRecordResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from './persistence.js'
import { authenticatedQuery, type Authenticated } from '../../trpc.js'
import { Config } from '../../config.js'

export const getReadingRecordProcedure = authenticatedQuery(handleGetReadingRecord)

export async function handleGetReadingRecord (
  authenticated: Authenticated<GetReadingRecord>,
  config: Config
): Promise<GetReadingRecordResult> {
  const validationResponse = await validate(authenticated.request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const getReadingRecordResponse = await persistence.getReadingRecord(authenticated)
  if (isErr(getReadingRecordResponse)) {
    return getReadingRecordResponse
  }
  const readingRecord = getReadingRecordResponse.data

  return ok(readingRecord)
}
