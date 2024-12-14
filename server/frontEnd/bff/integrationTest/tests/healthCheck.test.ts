import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/bff'
import { withConfig, withAuthToken } from './scenarios'

describe('healthCheck', () => {
    const config= withConfig()

    const healthCheck = new Client(config.service, withAuthToken).healthCheck()

    it('health check is successful', async () => {
      const readResult = await healthCheck.get()
      const read = expectOk(readResult)
    })
})

