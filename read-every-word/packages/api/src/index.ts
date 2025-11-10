import { router } from './lib/trpc.js';
import { readingRecordRouter } from './lib/readingRecord/index.js';

export const appRouter = router({
  readingRecord: readingRecordRouter
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

// Export config types for testing
export { type Config, fromEnv } from './lib/config.js';