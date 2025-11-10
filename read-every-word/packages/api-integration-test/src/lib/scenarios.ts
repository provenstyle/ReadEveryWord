import { expectOk } from '@read-every-word/foundation';
import { fromEnv, appRouter, Config } from '@read-every-word/api';
import { v4 as uuid } from 'uuid';
import { ReadingCycle, ReadingRecord } from '@read-every-word/domain';

export function withConfig(): Config {
  const configResult = fromEnv()
  return expectOk(configResult)
}

export function withUser(): User {
  return {
    authId: uuid()
  }
}

export function withCaller(): ReturnType<typeof appRouter.createCaller> {
  const config = withConfig()
  return appRouter.createCaller({ config })
}

export async function withReadingCycle(user: User): Promise<ReadingCycle> {
  const readingCycleResult = await withCaller().readingCycle.create({
    authId: user.authId,
    dateStarted: new Date().toISOString(),
    name: 'name'
  })
  return expectOk(readingCycleResult)
}

export async function withReadingRecord(user: User, readingCycle: ReadingCycle): Promise<ReadingRecord> {
  const readingRecordResult = await withCaller().readingRecord.create({
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