import { isErr, ok } from '@read-every-word/infrastructure'
import { GetReadingRecord, GetReadingRecordResult } from '@read-every-word/domain'
import { validate } from './validation'
import { Persistence } from './persistence'
import { fromEnv } from '../../config'

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
