import { isErr, ok } from '@read-every-word/foundation'
import { type SetDefaultReadingCycle, type SetDefaultReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { publicProcedure } from '../../trpc.js'

export const setDefaultReadingCycleProcedure = publicProcedure
  .input(r => r as SetDefaultReadingCycle)
  .mutation(async ({ input, ctx }): Promise<SetDefaultReadingCycleResult> => {
    const validationResponse = await validate(input)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const setDefaultReadingCycleResponse = await persistence.setDefaultReadingCycle(input)
    if (isErr(setDefaultReadingCycleResponse)) {
      return setDefaultReadingCycleResponse
    }
    const readingCycle = setDefaultReadingCycleResponse.data

    return ok(readingCycle)
  })
