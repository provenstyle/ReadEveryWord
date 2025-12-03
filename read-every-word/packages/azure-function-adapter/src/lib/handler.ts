import type {
  HttpRequest as AzureHttpRequest,
  HttpResponse as AzureHttpResponse,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import type { AnyRouter, inferRouterContext } from '@trpc/server';
import { resolveResponse } from '@trpc/server/http';
import type {
  HTTPBaseHandlerOptions,
  ResolveHTTPRequestOptionsContextFn,
  TRPCRequestInfo,
} from '@trpc/server/http';
import { toHTTPRequest } from './http-request.js';
import { toAzureResponse } from './http-response.js';
import { resolveRequestPath } from './request-path.js';
import type { AzureFunctionsCreateContextFn } from './context.js';

export type CreateAzureFunctionsHandlerOptions<TRouter extends AnyRouter> =
  HTTPBaseHandlerOptions<TRouter, Request> & {
    createContext?: AzureFunctionsCreateContextFn<TRouter>;
  };

type RequestHandler = (
  request: AzureHttpRequest,
  context: InvocationContext
) => Promise<HttpResponseInit | AzureHttpResponse>;

export function createAzureFunctionsHandler<TRouter extends AnyRouter>(
  opts: CreateAzureFunctionsHandlerOptions<TRouter>
): RequestHandler {
  return async function handler(request, context) {
    const httpRequest = await toHTTPRequest(request);
    const path = resolveRequestPath(request.url);

    const createContext: ResolveHTTPRequestOptionsContextFn<
      TRouter
    > = async (innerOpts: { info: TRPCRequestInfo }) => {
      return (await opts.createContext?.({
        azureRequest: request,
        azureContext: context,
        trpcInfo: innerOpts.info,
        httpRequest
      })) as inferRouterContext<TRouter>;
    };

    const response = await resolveResponse({
      ...opts,
      req: httpRequest,
      createContext,
      path,
      error: null,
      onError(payload) {
        opts.onError?.({
          ...payload,
          req: httpRequest as any,
        });
      },
    });

    return await toAzureResponse(response);
  };
}
