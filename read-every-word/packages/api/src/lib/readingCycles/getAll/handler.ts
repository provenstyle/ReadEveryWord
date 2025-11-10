import { isErr, ok } from '@read-every-word/foundation'
import { type GetReadingCycle, type GetReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { publicProcedure } from 'src/lib/trpc.js'

export const getAllReadingCyclesProcedure = publicProcedure
  .input(r => r as GetReadingCycle)
  .mutation(async ({ input, ctx }): Promise<GetReadingCycleResult> => {
    const validationResponse = await validate(input)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const getReadingCycleResponse = await persistence.getAllReadingCycles(input)
    if (isErr(getReadingCycleResponse)) {
      return getReadingCycleResponse
    }
    const readingCycle = getReadingCycleResponse.data
    return ok(readingCycle)
  })
