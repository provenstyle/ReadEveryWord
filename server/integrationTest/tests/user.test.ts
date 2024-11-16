import { Client } from '../infrastructure/client/client'
import { v4 as uuid } from 'uuid'
import { withConfig } from './scenarios'
import { expectOk } from '@read-every-word/library'

describe('Users', () => {
    const config = withConfig()

    const userClient = new Client(config.service).user

    it('can create a user then get it', async () => {
        // create
        const guid = uuid()
        const createResult = await userClient.create({
          authId: guid,
          email: `${guid}@email.com`
        })
        const createdUser = expectOk(createResult)

        // get
        const getResult = await userClient.get(createdUser.authId)
        const user = expectOk(getResult)
        expect(user.authId).toEqual(guid)
        expect(user.email).toEqual(`${guid}@email.com`)
    }, 10 * 1000)
})
