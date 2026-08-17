import { isErr, ok } from '@read-every-word/foundation'
import {CountReadingRecord, type CountReadingRecordResult} from '@read-every-word/domain'
import { Persistence } from './persistence.js'
import { authenticatedProcedure, authenticatedRequest } from '../../trpc.js'
import { validate } from './validation.js'

export const countReadingRecordProcedure = authenticatedProcedure
  .input(r => r as CountReadingRecord)
  .query(async ({ input, ctx }): Promise<CountReadingRecordResult> => {
    const request = authenticatedRequest(input, ctx)

    const validationResponse = await validate(request)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const countReadingRecordResponse = await persistence.countReadingRecords(request)
    if (isErr(countReadingRecordResponse)) {
      return countReadingRecordResponse
    }

    return ok(countReadingRecordResponse.data)
  })
