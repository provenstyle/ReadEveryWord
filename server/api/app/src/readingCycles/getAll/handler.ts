import { isErr, ok } from '@read-every-word/infrastructure'
import { GetReadingCycle, GetReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation'
import { Persistence } from '../persistence'
import { fromEnv } from '../../config'

export async function handleGetReadingCycle(request: GetReadingCycle): Promise<GetReadingCycleResult> {
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
  const getReadingCycleResponse = await persistence.getAllReadingCycles(request)
  if (isErr(getReadingCycleResponse)) {
    return getReadingCycleResponse
  }
  const readingCycle = getReadingCycleResponse.data

  return ok(readingCycle)
}
