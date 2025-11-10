import { isErr, ok } from '@read-every-word/foundation'
import { type GetReadingCycle, type GetReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { publicProcedure } from '../../trpc.js'
import { Config } from '../../config.js'

export const getAllReadingCyclesProcedure = publicProcedure
  .input(r => r as GetReadingCycle)
  .mutation(async ({ input, ctx }): Promise<GetReadingCycleResult> => {
    return handleGetReadingCycles(input, ctx.config)
  })

export const handleGetReadingCycles = async (request: GetReadingCycle, config: Config): Promise<GetReadingCycleResult> => {
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

