import { expectOk } from '@read-every-word/test-utils';
import { fromEnv, appRouter, Config, Caller } from '@read-every-word/api';
import { v4 as uuid } from 'uuid';
import { ReadingCycle, ReadingRecord } from '@read-every-word/domain';
import { withToken } from './tokenCache.js';

// Re-export withToken for convenience
export { withToken }

export function withConfig(): Config {
  const configResult = fromEnv()
  return expectOk(configResult)
}

export function withUser(): User {
  return {
    authId: uuid()
  }
}

export async function withCaller(): Promise<Caller> {
  const config = withConfig()
  const token = await withToken()
  return appRouter.createCaller({ 
    config,
    token
   })
}

export async function withReadingCycle(user: User): Promise<ReadingCycle> {
  const caller = await withCaller()
  const readingCycleResult = await caller.readingCycle.create({
    authId: user.authId,
    dateStarted: new Date().toISOString(),
    name: 'name'
  })
  return expectOk(readingCycleResult)
}

export async function withReadingRecord(user: User, readingCycle: ReadingCycle): Promise<ReadingRecord> {
  const caller = await withCaller()
  const readingRecordResult = await caller.readingRecord.create({
    authId: user.authId,
    readingCycleId: readingCycle.id,
    bookId: 0,
    chapterId: 0,
    dateRead: new Date().toISOString()
  })
  return expectOk(readingRecordResult)
}

export interface User {
  authId: string;
  // id: string;
  // lastModified: string;
  // email: string;
}
