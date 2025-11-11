import { router } from './lib/trpc.js';
import { healthCheckRouter } from './lib/healthCheck/index.js';
import { readingRecordRouter } from './lib/readingRecord/index.js';
import { readingCycleRouter } from './lib/readingCycles/index.js';
import { readSummaryRouter } from './lib/readSummary/index.js';

export const appRouter = router({
  healthCheck: healthCheckRouter,
  readingCycle: readingCycleRouter,
  readingRecord: readingRecordRouter,
  readSummary: readSummaryRouter
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

// Export config types for testing
export { type Config, fromEnv } from './lib/config.js';

// Export context creation functions
export { 
  createContext, 
  createContextFromHeaders,
  type Context,
  type AuthenticatedContext,
  type CreateContextOptions,
  type CreateContextFromHeadersOptions
} from './lib/trpc.js';