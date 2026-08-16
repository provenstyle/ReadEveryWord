import {
  expectOk,
  createTestIdentityProvider,
  testSubjectFor,
  type TestIdentityProvider
} from '@read-every-word/test-utils';
import { appRouter, Config, Caller } from '@read-every-word/api';
import { ReadingCycle, ReadingRecord } from '@read-every-word/domain';

// Tokens are signed locally rather than fetched from a real tenant. The api
// still performs its full RS256 verification against a JWKS, it just points at
// a loopback server we control.
//
// The reason is test isolation rather than convenience. The auth middleware
// overwrites input.authId with the token subject, so every test sharing one
// token would share one identity, one storage partition, and one accumulating
// pile of data. Signing our own tokens lets each test own a subject.
let provider: Promise<TestIdentityProvider> | undefined

// One provider per process, so every token in a suite validates against the
// same JWKS. Each jest worker gets its own on an ephemeral port.
function identityProvider(): Promise<TestIdentityProvider> {
  if (!provider) {
    provider = createTestIdentityProvider()
  }
  return provider
}

const REQUIRED_ENVIRONMENT = [
  'TABLE_STORAGE_CONNECTION_STRING'
]

// Nothing verifies these two, they are only echoed back by clientConfig.get, so
// fixed values are enough. Exported so the test can assert on what it supplied.
export const TEST_OPEN_ID_DOMAIN = 'local-test-idp.readeveryword.test'
export const TEST_OPEN_ID_CLIENT_ID = 'test-client-id'

export async function withConfig(): Promise<Config> {
  const missing = REQUIRED_ENVIRONMENT.filter(name => !process.env[name])
  if (missing.length > 0) {
    throw new Error(
      `Integration tests are not configured. Missing: ${missing.join(', ')}. ` +
      'Copy packages/api-integration-test/.env.example to .env and fill it in.'
    )
  }

  // Built here rather than through fromEnv because the openId half has to come
  // from the local provider. Storage is still whatever the environment says.
  const identity = await identityProvider()
  return {
    tableStorageConnectionString: process.env.TABLE_STORAGE_CONNECTION_STRING as string,
    openId: {
      jwksUri: identity.jwksUri,
      audience: identity.audience,
      issuer: identity.issuer,
      domain: TEST_OPEN_ID_DOMAIN,
      clientId: TEST_OPEN_ID_CLIENT_ID
    }
  }
}

/**
 * A fresh identity, with a token whose subject sanitizes to its authId.
 *
 * Keeping the two in step matters: the middleware derives authId from the
 * token, so a test that passes one authId and authenticates as another would
 * silently read and write a different partition than it asserts against.
 */
export async function withUser(): Promise<User> {
  const identity = await identityProvider()
  const { subject, authId } = testSubjectFor()
  return {
    authId,
    token: identity.signToken({ subject })
  }
}

/**
 * A caller for the given user. Omit the user for the endpoints that are public,
 * which are healthCheck and clientConfig.
 */
export async function withCaller(user?: User): Promise<Caller> {
  const config = await withConfig()
  return appRouter.createCaller({
    config,
    token: user?.token
  })
}

export async function withReadingCycle(user: User): Promise<ReadingCycle> {
  const caller = await withCaller(user)
  const readingCycleResult = await caller.readingCycle.create({
    authId: user.authId,
    dateStarted: new Date().toISOString(),
    name: 'name'
  })
  return expectOk(readingCycleResult)
}

export async function withReadingRecord(user: User, readingCycle: ReadingCycle): Promise<ReadingRecord> {
  const caller = await withCaller(user)
  const readingRecordResult = await caller.readingRecord.create({
    authId: user.authId,
    readingCycleId: readingCycle.id,
    bookId: 0,
    chapterId: 0,
    dateRead: new Date().toISOString()
  })
  return expectOk(readingRecordResult)
}

export interface User {
  authId: string
  token: string
}
