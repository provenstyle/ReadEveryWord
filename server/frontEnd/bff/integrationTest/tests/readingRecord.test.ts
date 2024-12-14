import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/bff'
import { withConfig } from './scenarios'
import { v4 as uuid } from 'uuid'

describe('reading', () => {
    const config= withConfig()

    const readClient = new Client(config.service).read

    it('read creates a read summary when none is found', async () => {
      const readResult = await readClient.get({
        authId: uuid()
      })
      const read = expectOk(readResult)
      expect(read.readingCycles.length).toEqual(1)
    })
})

