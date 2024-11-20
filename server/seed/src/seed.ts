import {
  handle, timer, asyncTimer,
  Result, isErr, ok
} from '@read-every-word/infrastructure'
import {
  Client, fromEnv, User, ReadingCycle, CreateReadingRecord, CreateFailed, GetFailed
} from '@read-every-word/client'
import {
  Bible
} from '@read-every-word/domain'
import { v4 as uuid } from 'uuid'
import { chunk } from 'lodash'

const USERS_TO_SEED = 100
//const BATCH_SIZE = 50
const BATCH_SIZE = 50

export function withUser(client: Client ): Promise<Result<User, CreateFailed>> {
  return asyncTimer(() => {
    const guid = uuid()
    return client.user.create({
      authId: guid,
      email: `${guid}@email.com`
    })
  }, 'Created user', true)
}

export function withReadingCycle(client: Client, user: User): Promise<Result<ReadingCycle, CreateFailed>> {
  return asyncTimer(() => {
    return client.readingCycle.create({
        authId: user.authId,
        dateStarted: new Date().toISOString()
      })
  }, 'Create readingCycle', true)
}

export function countReadingRecords(client: Client, readingCycle: ReadingCycle): Promise<Result<number, GetFailed>> {
  return asyncTimer(() => {
    return client.readingRecord.count({
      readingCycleId: readingCycle.id
    })
  }, 'Counted readingRecords', false)
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

  const batches = chunk<CreateReadingRecord>(requests, BATCH_SIZE)
  for(const batch of batches) {
    // console.log('')
    // console.log('starting a batch')
    const promises = []
    for(const request of batch) {
      promises.push(asyncTimer(() => {
        return client.readingRecord.create(request)
      }, 'Create readingRecord', true))
    }
    // console.log('waiting on a batch')
    await Promise.all(promises)
    // console.log('finished a batch')
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

    const countResult = await countReadingRecords(client, readingCycle)
    if (isErr(countResult)) {
      console.error('*** Error counting readingRecords ***')
      return countResult
    }
    const count = countResult.data
    const expectedRecords = 1189
    if (count != expectedRecords) {
      console.error(`*** Did not create all ${expectedRecords} records.  Counted ${count}. ***`)
    }

    return ok(undefined)
  }, 'Seeded a user and all reading records')
}

handle(async () => {
  const configResult = fromEnv()
  if (isErr(configResult)) {
    return configResult
  }
  const config = configResult.data.service
  const client = new Client(config)

  for(let i = 0; i < USERS_TO_SEED; i++) {
    await seedUser(client)
    console.log(`Created ${i + 1} user(s)`)
  }
})
