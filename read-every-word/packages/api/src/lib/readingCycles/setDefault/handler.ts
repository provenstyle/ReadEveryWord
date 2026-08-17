import { isErr, ok } from '@read-every-word/foundation'
import { type SetDefaultReadingCycle, type SetDefaultReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { authenticatedProcedure, authenticatedRequest } from '../../trpc.js'

export const setDefaultReadingCycleProcedure = authenticatedProcedure
  .input(r => r as SetDefaultReadingCycle)
  .mutation(async ({ input, ctx }): Promise<SetDefaultReadingCycleResult> => {
    const request = authenticatedRequest(input, ctx)

    const validationResponse = await validate(request)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const setDefaultReadingCycleResponse = await persistence.setDefaultReadingCycle(request)
    if (isErr(setDefaultReadingCycleResponse)) {
      return setDefaultReadingCycleResponse
    }
    const readingCycle = setDefaultReadingCycleResponse.data

    return ok(readingCycle)
  })
