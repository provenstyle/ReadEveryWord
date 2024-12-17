import { isErr, ok } from '@read-every-word/infrastructure'
import { CreateReadingCycle, CreateReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation'
import { Persistence } from '../persistence'
import { fromEnv } from '../../config'

export async function handleCreateReadingCycle(request: CreateReadingCycle): Promise<CreateReadingCycleResult> {
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
  const createReadingCycleResponse = await persistence.createReadingCycle(request)
  if (isErr(createReadingCycleResponse)) {
    return createReadingCycleResponse
  }
  const readingCycle = createReadingCycleResponse.data

  return ok(readingCycle)
}
