import { isErr, ok } from '@read-every-word/infrastructure'
import { DeleteReadingRecord, DeleteReadingRecordResult } from '@read-every-word/domain'
import { validate } from './validation'
import { Persistence } from './persistence'
import { fromEnv } from '../../config'

export async function handleDeleteReadingRecord(request: DeleteReadingRecord): Promise<DeleteReadingRecordResult> {
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
  const deleteReadingRecordResponse = await persistence.deleteReadingRecord(request)
  if (isErr(deleteReadingRecordResponse)) {
    return deleteReadingRecordResponse
  }
  const readingRecord = deleteReadingRecordResponse.data

  return ok(readingRecord)
}
