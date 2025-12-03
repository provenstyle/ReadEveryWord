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

const authMiddleware = t.middleware(async ({ input, next, ctx }) => {
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

  if (input && typeof input === 'object' && 'authId' in input) {
    input.authId = authId
  }

  return next({ 
    ctx: {
      ...ctx,
      jwt,
      authId
    } as AuthenticatedContext
  })
})

export const authenticatedProcedure = t.procedure.use(authMiddleware);
