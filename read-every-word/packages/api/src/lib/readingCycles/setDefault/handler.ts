import { isErr, ok } from '@read-every-word/foundation'
import { type SetDefaultReadingCycle, type SetDefaultReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { authenticatedMutation, type Authenticated } from '../../trpc.js'
import { Config } from '../../config.js'

export const setDefaultReadingCycleProcedure = authenticatedMutation(handleSetDefaultReadingCycle)

export async function handleSetDefaultReadingCycle (
  authenticated: Authenticated<SetDefaultReadingCycle>,
  config: Config
): Promise<SetDefaultReadingCycleResult> {
  const validationResponse = await validate(authenticated.request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const setDefaultReadingCycleResponse = await persistence.setDefaultReadingCycle(authenticated)
  if (isErr(setDefaultReadingCycleResponse)) {
    return setDefaultReadingCycleResponse
  }
  const readingCycle = setDefaultReadingCycleResponse.data

  return ok(readingCycle)
}
