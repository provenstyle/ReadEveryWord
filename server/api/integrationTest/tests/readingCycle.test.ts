import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/client'
import { withConfig, withUser } from './scenarios'

describe('readingCycle', () => {
    const config= withConfig()

    const readingCycleClient = new Client(config.service).readingCycle

    it('can create and get a reading cycle', async () => {
        const user = await withUser()

        // create
        const createResult = await readingCycleClient.create({
          authId: user.authId,
          dateStarted: new Date().toISOString()
        })
        expectOk(createResult)

        // get
        const readingCycleResult = await readingCycleClient.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(1)

        const readingCycle = readingCycles[0]
        expect(readingCycle.authId).toEqual(user.authId)
        expect(readingCycle.dateStarted).toBeDefined
        expect(readingCycle.dateCompleted).toBeUndefined
    }, 10 * 1000)

    // Can update dateComplete

    // Can update default to true

    // Cannot update default to false
    // Must set another Cycle as default
})
