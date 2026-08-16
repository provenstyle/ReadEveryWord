import { expectOk } from '@read-every-word/test-utils'
import { withCaller, withConfig, TEST_OPEN_ID_DOMAIN, TEST_OPEN_ID_CLIENT_ID } from './scenarios.js'

describe('clientConfig', () => {
    it('returns the auth0 settings the SPA needs', async () => {
        const config = await withConfig()
        const caller = await withCaller()

        const clientConfigResult = await caller.clientConfig.get({})
        const clientConfig = expectOk(clientConfigResult)

        expect(clientConfig.openId.domain).toEqual(TEST_OPEN_ID_DOMAIN)
        expect(clientConfig.openId.clientId).toEqual(TEST_OPEN_ID_CLIENT_ID)
        expect(clientConfig.openId.audience).toEqual(config.openId.audience)
    })

    it('does not leak the server side settings', async () => {
        const caller = await withCaller()

        const clientConfigResult = await caller.clientConfig.get({})
        const clientConfig = expectOk(clientConfigResult)

        expect(Object.keys(clientConfig)).toEqual(['openId'])
        expect(Object.keys(clientConfig.openId).sort()).toEqual(['audience', 'clientId', 'domain'])
    })
})
