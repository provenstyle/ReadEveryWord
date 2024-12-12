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
        expect(readingCycle.default).toBeUndefined
    }, 10 * 1000)

    it('Can update dateComplete', async () => {
        const user = await withUser()

        // create
        const createResult = await readingCycleClient.create({
          authId: user.authId,
          dateStarted: new Date().toISOString()
        })
        const created = expectOk(createResult)

        // update
        const updateResult = await readingCycleClient.update({
          authId: user.authId,
          id: created.id,
          dateCompleted: new Date().toISOString()
        })
        expectOk(updateResult)

        // get
        const readingCycleResult = await readingCycleClient.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(1)
        const readingCycle = readingCycles[0]
        expect(Date.parse(readingCycle.dateCompleted ?? '')).toBeGreaterThan(Date.parse(readingCycle.dateStarted))
    }, 10 * 1000)

    it('First readingCycle created is default', async () => {
        const user = await withUser()

        const createResult1 = await readingCycleClient.create({
          authId: user.authId,
          dateStarted: new Date().toISOString()
        })
        const created1 = expectOk(createResult1)

        const createResult2 = await readingCycleClient.create({
          authId: user.authId,
          dateStarted: new Date().toISOString()
        })
        const created2 = expectOk(createResult2)

        // get
        const readingCycleResult = await readingCycleClient.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(2)

        expect(readingCycles.find(x => x.id === created1.id)?.default).toEqual(true)
        expect(readingCycles.find(x => x.id === created2.id)?.default).toEqual(false)

    }, 10 * 1000)

    it('Can update default to true', async () => {
        const user = await withUser()

        const createResult1 = await readingCycleClient.create({
          authId: user.authId,
          dateStarted: new Date().toISOString()
        })
        const created1 = expectOk(createResult1)

        const createResult2 = await readingCycleClient.create({
          authId: user.authId,
          dateStarted: new Date().toISOString()
        })
        const created2 = expectOk(createResult2)

        const updated = await readingCycleClient.update({
          authId: user.authId,
          id: created2.id,
          default: true
        })
        expectOk(updated)

        // get
        const readingCycleResult = await readingCycleClient.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(2)

        expect(readingCycles.find(x => x.id === created1.id)?.default).toEqual(false)
        expect(readingCycles.find(x => x.id === created2.id)?.default).toEqual(true)

    }, 10 * 1000)

    // Cannot update default to false
    // Must set another Cycle as default
})
