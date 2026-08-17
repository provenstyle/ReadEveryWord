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
// derives authId from the token subject, so every test sharing one
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

/**
 * Shuts the shared provider down and forgets it.
 *
 * The server is unref'd, but the connections jwks-rsa opens against it are not,
 * so a suite that authenticates leaves a live socket behind and jest reports
 * that it could not exit. jest.teardown.cjs calls this after every suite, so no
 * individual test file has to remember to.
 */
export async function closeIdentityProvider(): Promise<void> {
  if (!provider) {
    return
  }
  const pending = provider
  provider = undefined
  await (await pending).close()
}

const REQUIRED_ENVIRONMENT = [
  'TABLE_STORAGE_CONNECTION_STRING'
]

// Nothing verifies these two, they are only echoed back by clientConfig.get, so
// fixed values are enough. Exported so the test can assert on what it supplied.
export const TEST_OPEN_ID_DOMAIN = 'local-test-idp.readeveryword.test'
export const TEST_OPEN_ID_CLIENT_ID = 'test-client-id'

// Well formed but unreachable, so a call that gets past auth fails in
// persistence rather than while constructing the client. Suites that only care
// whether the auth middleware admits a caller use this and never reach storage.
export const UNREACHABLE_STORAGE =
  'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;' +
  'AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;' +
  'TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;' +
  'BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;'

/**
 * A Config that can authenticate and nothing else.
 *
 * It trusts the given provider, and its storage is deliberately unreachable, so
 * a test that gets past auth and then touches persistence fails rather than
 * quietly succeeding against a real account. Unlike withConfig it needs no
 * environment at all, so auth focused suites run without Azurite.
 *
 * Sync, unlike the other withX fixtures here, because there is nothing to await.
 */
export function withAuthOnlyConfig(provider: TestIdentityProvider): Config {
  return {
    tableStorageConnectionString: UNREACHABLE_STORAGE,
    openId: {
      jwksUri: provider.jwksUri,
      audience: provider.audience,
      issuer: provider.issuer,
      domain: TEST_OPEN_ID_DOMAIN,
      clientId: TEST_OPEN_ID_CLIENT_ID
    }
  }
}

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
 * Requests cannot name an authId at all, so the token is the only thing that
 * decides which partition a test touches. authId is kept here so a test can
 * still say which partition it expects to be talking to.
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
    dateStarted: new Date().toISOString(),
    name: 'name'
  })
  return expectOk(readingCycleResult)
}

export async function withReadingRecord(user: User, readingCycle: ReadingCycle): Promise<ReadingRecord> {
  const caller = await withCaller(user)
  const readingRecordResult = await caller.readingRecord.create({
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
