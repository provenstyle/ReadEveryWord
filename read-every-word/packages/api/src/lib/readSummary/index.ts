import { router } from '../trpc.js';
import { getReadSummaryProcedure } from './get/handler.js'

export const readSummaryRouter = router({
  get: getReadSummaryProcedure
});
