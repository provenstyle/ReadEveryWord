// Closes the shared test identity provider after every suite.
//
// createTestIdentityProvider unrefs its server, so the listening socket alone
// would not hold the process open. The connections jwks-rsa opens against it
// are a different matter: an accepted socket is its own handle and is not
// covered by the server's unref, so any suite that authenticates finishes with
// a live TCP handle and jest reports that it could not exit.
//
// Registered through setupFilesAfterEnv rather than an afterAll in each test
// file, because a new suite that authenticates should not have to know about
// this to avoid reintroducing the warning.
import { closeIdentityProvider } from './src/lib/scenarios.js'

afterAll(async () => {
  await closeIdentityProvider()
})
