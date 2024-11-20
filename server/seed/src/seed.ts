import {
  handle, timer, asyncTimer,
  Result, isErr, ok
} from '@read-every-word/infrastructure'
import {
  Client, fromEnv, User, ReadingCycle, CreateReadingRecord, CreateFailed
} from '@read-every-word/client'
import {
  Bible
} from '@read-every-word/domain'
import { v4 as uuid } from 'uuid'
import { chunk } from 'lodash'

export async function withUser(client: Client ): Promise<Result<User, CreateFailed>> {
  const guid = uuid()
  return await asyncTimer(async () => {
    return client.user.create({
      authId: guid,
      email: `${guid}@email.com`
    })
  }, 'Created user', true)
}

export async function withReadingCycle(client: Client, user: User): Promise<Result<ReadingCycle, CreateFailed>> {
  return await asyncTimer(async () => {
    return client.readingCycle.create({
        authId: user.authId,
        dateStarted: new Date().toISOString()
      })
  }, 'Create readingCycle', true)
}

export async function withReadingRecords(client: Client, readingCycle: ReadingCycle): Promise<Result<undefined, CreateFailed>> {
  const bible = new Bible()
  const date = new Date().toISOString()
  const requests: CreateReadingRecord[] = []

  for(const book of bible.books){
    for(const chapter of book.chapters) {
      requests.push({
        readingCycleId: readingCycle.id,
        bookId: book.id,
        chapterId: chapter.id,
        dateRead: date
      })
    }
  }

  const batches = chunk<CreateReadingRecord>(requests, 100)
  for(const batch of batches) {
    const promises = []
    for(const request of batch) {
      promises.push(asyncTimer(async () => {
        await client.readingRecord.create(request)
      }, 'Create readingRecord', true))
    }
    await Promise.all(promises)
  }

  return ok(undefined)
}

export async function seedUser(client: Client) {
  await asyncTimer(async () => {
    console.log('')
    const userResult = await withUser(client)
    if (isErr(userResult)) {
      return userResult
    }
    const user = userResult.data

    const readingCycleResult = await withReadingCycle(client, user)
    if (isErr(readingCycleResult)) {
      return readingCycleResult
    }
    const readingCycle = readingCycleResult.data

    const readingRecordResult = await withReadingRecords(client, readingCycle)
    if (isErr(readingRecordResult)) {
      return readingRecordResult
    }

    return ok(undefined)
  }, 'Seeded a user')
}

handle(async () => {
  const configResult = fromEnv()
  if (isErr(configResult)) {
    return configResult
  }
  const config = configResult.data.service
  const client = new Client(config)

  for(let i = 0; i < 100; i++) {
    await seedUser(client)
  }
})
