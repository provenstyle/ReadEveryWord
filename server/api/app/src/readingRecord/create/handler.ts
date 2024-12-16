import { isErr, ok } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { Persistence } from './persistence'
import { fromEnv } from '../../config'
import { CreateReadingRecord, CreateReadingRecordResult } from '@read-every-word/domain'

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
