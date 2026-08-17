import { initTRPC, TRPCError } from '@trpc/server';
import { type Config } from './config.js'
import { Authentication, sanitizeAuthId, type JwtPayload } from './authentication.js'
import { isErr } from '@read-every-word/foundation'

export interface Context {
  config: Config,
  token?: string
}

export interface AuthenticatedContext extends Context {
  jwt: JwtPayload
  authId: string
}

/**
 * Who the caller is, according to their verified token.
 *
 * authId is the table storage PartitionKey and the blob container name used for
 * locking, so this is what decides whose data a request touches. It is derived
 * from the token and never from the request body.
 */
export interface Principal {
  authId: string
}

/**
 * A request together with the identity it runs as, kept in separate slots.
 *
 * The two are deliberately not merged. An earlier version spread the token's
 * authId over the client's input, which was only safe because authId came last
 * in the spread - one reordering away from letting a caller act on another
 * user's data. Here a client supplied authId can only ever land inside
 * `request`, where nothing reads it: every consumer reads `principal.authId`.
 */
export interface Authenticated<TRequest> {
  request: TRequest
  principal: Principal
}

export interface CreateContextFromHeadersOptions {
  config: Config
  headers: Headers
}

export function createContextFromHeaders(options: CreateContextFromHeadersOptions): Context {
  const { config, headers } = options
  
  const authHeader = headers.get('Authorization')  || headers.get('authorization')
  
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim() || undefined
  
  return {
    config,
    token
  }
}

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(async ({ next, ctx }) => {
  if (!ctx.token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No token provided'
    })
  }

  const authn = new Authentication(ctx.config.openId)
  const validationResult = await authn.validateToken(ctx.token)
  
  if (isErr(validationResult)) {
    const err = validationResult.err
    switch (err.code) {
      case 'not-authenticated':
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token'
        })
      case 'unexpected-authentication-exception':
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Authentication error'
        })
      default:
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unknown authentication error'
        })
    }
  }

  const jwt = validationResult.data
  const authId = sanitizeAuthId(jwt)

  // This middleware deliberately does not touch the input.
  //
  // It used to try, and it silently did nothing: middlewares only see input from
  // parsers registered before them, and authenticatedProcedure is built as
  // t.procedure.use(authMiddleware) with every .input() added afterwards, so
  // `input` was always undefined here. authId travels on the context instead,
  // and the builders below are what put it on a request.
  return next({
    ctx: {
      ...ctx,
      jwt,
      authId
    } as AuthenticatedContext
  })
})

export const authenticatedProcedure = t.procedure.use(authMiddleware);

// The input cast below is because trpc types a passthrough parser's output as
// , which cannot be
// narrowed to TRequest generically. The parser returns its argument unchanged.
//
// The four builders below are the only places identity is attached to a
// request. Resolvers do not assemble it themselves, so there is no per slice
// step to forget and no ordering to get wrong.
//
// The request types carry no authId at all, so a handler that tries to read one
// off the request will not compile.

const principalFor = (ctx: AuthenticatedContext): Principal => ({ authId: ctx.authId })

/** A query taking client input. */
export const authenticatedQuery = <TRequest, TResult>(
  handle: (authenticated: Authenticated<TRequest>, config: Config) => Promise<TResult>
) =>
  authenticatedProcedure
    .input(r => r as TRequest)
    .query(async ({ input, ctx }): Promise<TResult> =>
      handle({ request: input as TRequest, principal: principalFor(ctx) }, ctx.config))

/** A mutation taking client input. */
export const authenticatedMutation = <TRequest, TResult>(
  handle: (authenticated: Authenticated<TRequest>, config: Config) => Promise<TResult>
) =>
  authenticatedProcedure
    .input(r => r as TRequest)
    .mutation(async ({ input, ctx }): Promise<TResult> =>
      handle({ request: input as TRequest, principal: principalFor(ctx) }, ctx.config))

/** A query whose only input is who is asking. Takes no arguments. */
export const principalQuery = <TResult>(
  handle: (principal: Principal, config: Config) => Promise<TResult>
) =>
  authenticatedProcedure
    .query(async ({ ctx }): Promise<TResult> => handle(principalFor(ctx), ctx.config))

/** A mutation whose only input is who is asking. Takes no arguments. */
export const principalMutation = <TResult>(
  handle: (principal: Principal, config: Config) => Promise<TResult>
) =>
  authenticatedProcedure
    .mutation(async ({ ctx }): Promise<TResult> => handle(principalFor(ctx), ctx.config))
