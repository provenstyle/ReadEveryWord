import { isErr, ok } from '@read-every-word/foundation'
import {type CountReadingRecordResult} from '@read-every-word/domain'
import { Persistence } from './persistence.js'
import { authenticatedProcedure } from '../../trpc.js'
import { z } from 'zod'

export const countReadingRecordProcedure = authenticatedProcedure
  .input(z.object({
    authId: z.string(),
    readingCycleId: z.uuid()
  }))
  .query(async ({ input, ctx }): Promise<CountReadingRecordResult> => {
    const persistence = new Persistence(ctx.config)
    const countReadingRecordResponse = await persistence.countReadingRecords(input)
    if (isErr(countReadingRecordResponse)) {
      return countReadingRecordResponse
    }

    return ok(countReadingRecordResponse.data)
  })
