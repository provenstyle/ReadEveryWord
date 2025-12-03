import { router } from './lib/trpc.js';
import { healthCheckRouter } from './lib/healthCheck/index.js';
import { readingRecordRouter } from './lib/readingRecord/index.js';
import { readingCycleRouter } from './lib/readingCycles/index.js';
import { readSummaryRouter } from './lib/readSummary/index.js';

export { type Config, fromEnv } from './lib/config.js';

export const appRouter = router({
  healthCheck: healthCheckRouter,
  readingCycle: readingCycleRouter,
  readingRecord: readingRecordRouter,
  readSummary: readSummaryRouter
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

// Export caller type for convenience
export type Caller = Awaited<ReturnType<typeof appRouter.createCaller>>;

export { createContextFromHeaders } from './lib/trpc.js';
