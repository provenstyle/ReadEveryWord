import { router } from '../trpc.js';
import { getHealthCheckProcedure } from './get/handler.js'

export const healthCheckRouter = router({
  get: getHealthCheckProcedure
});
