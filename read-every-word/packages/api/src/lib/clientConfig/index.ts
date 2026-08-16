import { router } from '../trpc.js';
import { getClientConfigProcedure } from './get/handler.js'

export const clientConfigRouter = router({
  get: getClientConfigProcedure
});
