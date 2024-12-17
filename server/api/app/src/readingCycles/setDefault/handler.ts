import { isErr, ok } from '@read-every-word/infrastructure'
import { SetDefaultReadingCycle, SetDefaultReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation'
import { Persistence } from '../persistence'
import { fromEnv } from '../../config'

export async function handleSetDefaultReadingCycle(request: SetDefaultReadingCycle): Promise<SetDefaultReadingCycleResult> {
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
  const setDefaultReadingCycleResponse = await persistence.setDefaultReadingCycle(request)
  if (isErr(setDefaultReadingCycleResponse)) {
    return setDefaultReadingCycleResponse
  }
  const readingCycle = setDefaultReadingCycleResponse.data

  return ok(readingCycle)
}
