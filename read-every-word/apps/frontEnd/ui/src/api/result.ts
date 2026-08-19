import { TRPCClientError } from '@trpc/client'
import {
  err,
  NotFound,
  ServerError,
  Unauthorized,
  UnexpectedHttpException,
  UnexpectedResponseCode,
  type Result,
} from '@read-every-word/foundation'

export type TransportFailed =
  | Unauthorized
  | NotFound
  | ServerError
  | UnexpectedResponseCode
  | UnexpectedHttpException

/**
 * Procedures return Result values as their success payload, so isOk/isErr keep
 * working across the wire: the discriminant is a plain __result string and the
 * error classes carry code/message as instance fields, both of which survive
 * JSON. Prototypes do not survive, so never use instanceof on the err side.
 *
 * trpc only throws for transport and middleware failures, which is what this
 * maps back onto the domain's error classes.
 */
export async function fromTrpc<T, E> (
  call: () => Promise<Result<T, E>>
): Promise<Result<T, E | TransportFailed>> {
  try {
    return await call()
  } catch (e) {
    if (e instanceof TRPCClientError) {
      switch (e.data?.code) {
        case 'UNAUTHORIZED': return err(new Unauthorized())
        case 'NOT_FOUND': return err(new NotFound())
        case 'INTERNAL_SERVER_ERROR': return err(new ServerError(e.message))
        default: return err(new UnexpectedResponseCode(e.data?.httpStatus))
      }
    }
    return err(new UnexpectedHttpException(e))
  }
}
