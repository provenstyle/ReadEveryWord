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

export function withUser(client: Client ): Promise<Result<User, CreateFailed>> {
  return asyncTimer(() => {
    const guid = uuid()
    return client.user.create({
      authId: guid,
      email: `${guid}@email.com`
    })
  }, 'Created user', false)
}

export function withReadingCycle(client: Client, user: User): Promise<Result<ReadingCycle, CreateFailed>> {
  return asyncTimer(() => {
    return client.readingCycle.create({
        authId: user.authId,
        dateStarted: new Date().toISOString()
      })
  }, 'Create readingCycle', false)
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

  const batches = chunk<CreateReadingRecord>(requests, 10)
  for(const batch of batches) {
    console.log('')
    console.log('starting a batch')
    const promises = []
    for(const request of batch) {
      promises.push(asyncTimer(() => {
        return client.readingRecord.create(request)
      }, 'Create readingRecord', false))
    }
    console.log('waiting on a batch')
    await Promise.all(promises)
    console.log('finished a batch')
  }

  return ok(undefined)
}

export async function seedUser(client: Client) {
  await asyncTimer(async () => {
    console.log('')
    const userResult = await withUser(client)
    if (isErr(userResult)) {
      console.log('*** Error creating user ***')
      return userResult
    }
    const user = userResult.data

    const readingCycleResult = await withReadingCycle(client, user)
    if (isErr(readingCycleResult)) {
      console.log('*** Error creating readingCycle ***')
      return readingCycleResult
    }
    const readingCycle = readingCycleResult.data

    const readingRecordResult = await withReadingRecords(client, readingCycle)
    if (isErr(readingRecordResult)) {
      console.error('*** Error creating readingRecord ***')
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

  for(let i = 0; i < 1; i++) {
    await seedUser(client)
  }

})
