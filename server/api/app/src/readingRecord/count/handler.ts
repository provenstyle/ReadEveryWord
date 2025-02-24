import { isErr, ok } from '@read-every-word/infrastructure'
import { type CountReadingRecord, type CountReadingRecordResult} from '@read-every-word/domain'
import { validate } from './validation'
import { Persistence } from './persistence'
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
