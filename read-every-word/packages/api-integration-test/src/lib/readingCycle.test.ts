import { expectOk } from '@read-every-word/test-utils'
import { withCaller, withUser } from './scenarios.js'

// A caller is bound to one identity, because the auth middleware replaces
// input.authId with the token subject. Each test takes its own user, so each
// test gets its own storage partition and reruns stay idempotent.
describe('readingCycle', () => {

    it('can create and get a reading cycle', async () => {
        const user = await withUser()
        const caller = await withCaller(user)

        // create
        const createResult = await caller.readingCycle.create({
          authId: user.authId,
          dateStarted: new Date().toISOString(),
          name: 'name'
        })
        expectOk(createResult)

        // get
        const readingCycleResult = await caller.readingCycle.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(1)

        const readingCycle = readingCycles[0]
        expect(readingCycle.authId).toEqual(user.authId)
        expect(readingCycle.name).toEqual('name')
        expect(readingCycle.dateStarted).toBeDefined()
        expect(readingCycle.dateCompleted).toBeUndefined()
        expect(readingCycle.default).toEqual(true)
    }, 10 * 1000)

    it('Can update dateComplete', async () => {
        const user = await withUser()
        const caller = await withCaller(user)

        // create
        const createResult = await caller.readingCycle.create({
          authId: user.authId,
          dateStarted: new Date().toISOString(),
          name: 'name'
        })
        const created = expectOk(createResult)

        // update
        const updateResult = await caller.readingCycle.update({
          authId: user.authId,
          id: created.id,
          dateCompleted: new Date().toISOString()
        })
        expectOk(updateResult)

        // get
        const readingCycleResult = await caller.readingCycle.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(1)
        const readingCycle = readingCycles[0]
        expect(Date.parse(readingCycle.dateCompleted ?? '')).toBeGreaterThan(Date.parse(readingCycle.dateStarted))
    }, 10 * 1000)

    it('First readingCycle created is default', async () => {
        const user = await withUser()
        const caller = await withCaller(user)

        const createResult1 = await caller.readingCycle.create({
          authId: user.authId,
          dateStarted: new Date().toISOString(),
          name: 'name'
        })
        const created1 = expectOk(createResult1)

        const createResult2 = await caller.readingCycle.create({
          authId: user.authId,
          dateStarted: new Date().toISOString(),
          name: 'name'
        })
        const created2 = expectOk(createResult2)

        // get
        const readingCycleResult = await caller.readingCycle.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(2)

        expect(readingCycles.find(x => x.id === created1.id)?.default).toEqual(true)
        expect(readingCycles.find(x => x.id === created2.id)?.default).toEqual(false)

    }, 10 * 1000)

    it('Can update default to true', async () => {
        const user = await withUser()
        const caller = await withCaller(user)

        const createResult1 = await caller.readingCycle.create({
          authId: user.authId,
          dateStarted: new Date().toISOString(),
          name: 'name'
        })
        const created1 = expectOk(createResult1)

        const createResult2 = await caller.readingCycle.create({
          authId: user.authId,
          dateStarted: new Date().toISOString(),
          name: 'name'
        })
        const created2 = expectOk(createResult2)

        const updated = await caller.readingCycle.setDefault({
          authId: user.authId,
          id: created2.id
        })
        expectOk(updated)

        // get
        const readingCycleResult = await caller.readingCycle.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(2)

        expect(readingCycles.find(x => x.id === created1.id)?.default).toEqual(false)
        expect(readingCycles.find(x => x.id === created2.id)?.default).toEqual(true)
    }, 10 * 1000)

    it('Can update name', async () => {
        const user = await withUser()
        const caller = await withCaller(user)

        // create
        const createResult = await caller.readingCycle.create({
          authId: user.authId,
          dateStarted: new Date().toISOString(),
          name: 'name'
        })
        const created = expectOk(createResult)

        // update
        const updateResult = await caller.readingCycle.update({
          authId: user.authId,
          id: created.id,
          name: 'a new name'
        })
        expectOk(updateResult)

        // get
        const readingCycleResult = await caller.readingCycle.get({authId: user.authId})
        const readingCycles = expectOk(readingCycleResult)
        expect(readingCycles.length).toEqual(1)
        const readingCycle = readingCycles[0]
        expect(readingCycle.name).toEqual('a new name')
    }, 10 * 1000)

    it('concurrent calls only create 1 default readingCycle', async () => {
      const user = await withUser()
      const caller = await withCaller(user)

      const promises = []
      for (let i = 0; i < 5; i++) {
        promises.push(
          caller.readingCycle.create({
            authId: user.authId,
            dateStarted: new Date().toISOString(),
            name: `${i}`
          })
        )
      }

      await Promise.all(promises)

      const readingCycleResult = await caller.readingCycle.get({
        authId: user.authId
      })
      const readingCycles = expectOk(readingCycleResult)

      const defaults = readingCycles.filter(x => x.default)

      expect(defaults.length).toEqual(1)
    }, 30 * 1000)
})
