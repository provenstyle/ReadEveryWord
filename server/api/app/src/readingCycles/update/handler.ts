import { isErr, ok } from '@read-every-word/infrastructure'
import { UpdateReadingCycle, UpdateReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation'
import { Persistence } from '../persistence'
import { fromEnv } from '../../config'

export async function handleUpdateReadingCycle(request: UpdateReadingCycle): Promise<UpdateReadingCycleResult> {
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
  const updateReadingCycleResponse = await persistence.updateReadingCycle(request)
  if (isErr(updateReadingCycleResponse)) {
    return updateReadingCycleResponse
  }
  const readingCycle = updateReadingCycleResponse.data

  return ok(readingCycle)
}
