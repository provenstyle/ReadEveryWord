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
 * Options for creating context from HTTP headers
 */
export interface CreateContextFromHeadersOptions {
  config: Config
  headers: Headers | Record<string, string | string[] | undefined>
}

/**
 * Options for creating context for server-side calls
 */
export interface CreateContextOptions {
  config: Config
  token?: string
}

/**
 * Creates a tRPC context from HTTP headers (extracts Authorization header)
 */
export function createContextFromHeaders(options: CreateContextFromHeadersOptions): Context {
  const { config, headers } = options
  
  // Handle both Headers object and plain object
  let authHeader: string | undefined
  if (headers instanceof Headers) {
    authHeader = headers.get('Authorization') ?? undefined
  } else {
    const auth = headers['authorization'] || headers['Authorization']
    authHeader = Array.isArray(auth) ? auth[0] : auth
  }
  
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim() || undefined
  
  return {
    config,
    token
  }
}

/**
 * Creates a tRPC context for server-side calls
 */
export function createContext(options: CreateContextOptions): Context {
  return {
    config: options.config,
    token: options.token
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
