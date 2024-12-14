import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/bff'
import { withConfig, withAuthToken } from './scenarios'

describe('reading', () => {
    const config= withConfig()

    const readClient = new Client(config.service, withAuthToken).readClient()

    it('return the default reading cycle', async () => {
      const readResult = await readClient.get()
      const read = expectOk(readResult)
      expect(read.readingCycles.length).toEqual(1)
    })
})

