import { expectOk } from '@read-every-word/foundation'
import { withCaller } from './scenarios.js'

describe('healthCheck', () => {
    it('healthCheckSucceeds', async () => {
        const caller = await withCaller()
        const readingRecordResult = await caller.healthCheck.get({})
        const healthCheck = expectOk(readingRecordResult)
        expect(healthCheck.length).toEqual(1)
        expect(healthCheck[0].name).toEqual("Read Every Word Api")
        expect(healthCheck[0].configured).toEqual(true)
    })
})

