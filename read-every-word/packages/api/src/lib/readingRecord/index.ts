import { router } from '../trpc.js';
import { countReadingRecordProcedure } from './count/handle.js'
import { createReadingRecordProcedure } from './create/handler.js'

export const readingRecordRouter = router({
  count: countReadingRecordProcedure,
  create: createReadingRecordProcedure
});
