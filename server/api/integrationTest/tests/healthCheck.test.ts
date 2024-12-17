import { withConfig, withUser, withReadingCycle } from './scenarios'
import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/client'

describe('healthCheck', () => {
    const config= withConfig()

    const healthCheckClient = new Client(config.service).healthCheck

    it('healthCheckSucceeds', async () => {
        const readingRecordResult = await healthCheckClient.get()
        const healthCheck = expectOk(readingRecordResult)
        expect(healthCheck.length).toEqual(1)
        expect(healthCheck[0].name).toEqual("Read Every Word Api")
        expect(healthCheck[0].configured).toEqual(true)

    })
})

