import { router } from '../trpc.js';
import { createReadingRecordProcedure } from './create/handler.js'
import { deleteReadingRecordProcedure } from './delete/handler.js'
import { getReadingRecordProcedure } from './get/handler.js'

export const readingRecordRouter = router({
  create: createReadingRecordProcedure,
  delete: deleteReadingRecordProcedure,
  get: getReadingRecordProcedure
});
