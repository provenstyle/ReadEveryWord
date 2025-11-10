import { router } from '../trpc.js';
import { getAllReadingCyclesProcedure } from './getAll/handler.js'
import { createReadingCycleProcedure } from './create/handler.js'
import { setDefaultReadingCycleProcedure } from './setDefault/handler.js'
import { updateReadingCycleProcedure } from './update/handler.js'

export const readingCycleRouter = router({
  getAll: getAllReadingCyclesProcedure,
  create: createReadingCycleProcedure,
  setDefault: setDefaultReadingCycleProcedure,
  update: updateReadingCycleProcedure
});
