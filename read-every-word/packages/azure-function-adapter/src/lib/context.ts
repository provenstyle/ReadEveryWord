import type {
  InvocationContext,
  HttpRequest as AzureHttpRequest,
} from '@azure/functions';
import type { AnyRouter, inferRouterContext } from '@trpc/server';
import type { TRPCRequestInfo } from '@trpc/server/http';

export type AzureFunctionsContextOption = {
  azureContext: InvocationContext;
  azureRequest: AzureHttpRequest;
  trpcInfo: TRPCRequestInfo;
  httpRequest: Request;
};

export type AzureFunctionsCreateContextFn<TRouter extends AnyRouter> = (
  options: AzureFunctionsContextOption
) => inferRouterContext<TRouter> | Promise<inferRouterContext<TRouter>>;
