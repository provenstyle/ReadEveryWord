import { fromEnv, type Config } from '../infrastructure/config'
import { expectOk } from '../infrastructure/ResultExpectations'
import { Client } from '../infrastructure/client/client'
import { User } from '../infrastructure/client/userClient'
import { ReadingCycle } from '../infrastructure/client/readingCycleClient'
import { v4 as uuid } from 'uuid'

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
        dateStarted: new Date().toISOString()
      })
    return expectOk(readingCycleResult)
}
