import { router } from '../trpc.js';
import { countReadingRecordProcedure } from './count/handle.js'

export const readingRecordRouter = router({
  count: countReadingRecordProcedure
});
