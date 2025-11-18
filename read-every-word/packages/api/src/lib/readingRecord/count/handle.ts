import { isErr, ok } from '@read-every-word/foundation'
import {CountReadingRecord, type CountReadingRecordResult} from '@read-every-word/domain'
import { Persistence } from './persistence.js'
import { authenticatedProcedure } from '../../trpc.js'
import { validate } from './validation.js'

export const countReadingRecordProcedure = authenticatedProcedure
  .input(r => r as CountReadingRecord)
  .query(async ({ input, ctx }): Promise<CountReadingRecordResult> => {
    const validationResponse = await validate(input)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const countReadingRecordResponse = await persistence.countReadingRecords(input)
    if (isErr(countReadingRecordResponse)) {
      return countReadingRecordResponse
    }

    return ok(countReadingRecordResponse.data)
  })
