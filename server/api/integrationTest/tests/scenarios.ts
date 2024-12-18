import { v4 as uuid } from 'uuid'
import { expectOk } from '@read-every-word/infrastructure'
import { Client, Config, fromEnv, User } from '@read-every-word/client'
import { ReadingCycle, ReadingRecord } from '@read-every-word/domain'

export function withConfig(): Config {
  const configResult = fromEnv()
  return expectOk(configResult)
}

export async function withUser(): Promise<User> {
  const config = withConfig()
  const userClient = new Client(config.service).user
  const guid = uuid()
  const createdUserResult = await userClient.create({
    authId: guid,
    email: `${guid}@email.com`
  })
  return expectOk(createdUserResult)
}

export async function withReadingCycle(user: User): Promise<ReadingCycle> {
    const config = withConfig()
    const readingCycleClient = new Client(config.service).readingCycle
    const readingCycleResult = await readingCycleClient
      .create({
        authId: user.authId,
        dateStarted: new Date().toISOString(),
        name: 'name'
      })
    return expectOk(readingCycleResult)
}

export async function withReadingRecord(user: User, readingCycle: ReadingCycle): Promise<ReadingRecord> {
    const config = withConfig()
    const readingRecordResult = await new Client(config.service).readingRecord.create({
      authId: user.authId,
      readingCycleId: readingCycle.id,
      bookId: 0,
      chapterId: 0,
      dateRead: new Date().toISOString()
    })
    return expectOk(readingRecordResult)
}
