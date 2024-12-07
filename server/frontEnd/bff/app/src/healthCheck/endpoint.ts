import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { handleGetHealthCheck, GetHealthCheckSucceeded, GetHealthCheckFailed } from './handler'
import { assertNever, isOk} from '@read-every-word/infrastructure'

app.http('health_check', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: wrapHandler(handleEndpoint),
  route: 'healthCheck'
})

type EndPointHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>

function wrapHandler(handler: EndPointHandler): EndPointHandler {
  return async function (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // Code to execute before the handler
    console.log('Before handler execution');

    // Call the original handler
    const response = await handler(request, context);

    // Code to execute after the handler
    console.log('After handler execution');

    return response;
  };
}

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)
    const result = await handleGetHealthCheck()

    return isOk(result)
      ? handleSuccess(result.data)
      : handleFailures(result.err)

  } catch (error) {
    console.error(`Error handling "${request.url}"`, error)
    return ({ status: 500 })
  }
}

const handleSuccess = (data: GetHealthCheckSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: GetHealthCheckFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'unexpected-http-exception': return json(500, err)
    case 'unexpected-response-code': return json(500, err)
    case 'server-error': return json(500, err)
    case 'validation-failed': return json(400, err)
    case 'not-found': return json(404, err)
    default: return assertNever(err)
  }
}

const json = (status: number, data: any) => {
  return {
    status: status,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
}