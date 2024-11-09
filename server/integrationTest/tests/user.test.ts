import { Result, isErr } from "../infrastructure/Result"
import { fromEnv } from "../infrastructure/config"
import { UserClient } from "../infrastructure/client"
import { v4 as uuid } from 'uuid'

describe('Users', () => {
    const configResult = fromEnv()
    const config = expectOk(configResult)
    console.log(config)

    const userClient = new UserClient(config.service)

    it('can get', async () => {
        const getResult = await userClient.get('1')
        const user = expectOk(getResult)
        console.log(user)
    })

    it('can create', async () => {
        const guid = uuid()
        const createResult = await userClient.create({
          authId: guid,
          email: `${guid}@email.com`
        })
        const user = expectOk(createResult)
        console.log(user)
    })
})

export function expectOk<T, E> (response: Result<T, E>): T {
    if (isErr(response)) {
      console.log(response.err)
      throw new Error('Expected successful response')
    }
    return response.data
  }