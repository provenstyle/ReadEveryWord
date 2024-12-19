import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever, json } from '@read-every-word/infrastructure'
import { type GetReadSummary, type GetReadSummarySucceeded, type GetReadSummaryFailed } from '@read-every-word/domain'
import { handleGetReadSummary } from './handler'

app.http('get_read_summary', {
  methods: ['GET'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'readSummary/{authId}'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext ): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const getRequest: GetReadSummary = {
      authId: request.params.authId ?? ''
    }

    const result = await handleGetReadSummary(getRequest)

    return isOk(result)
      ? handleSuccess(result.data)
      : handleFailures(result.err)

  } catch (error) {
    console.error(`Error handling "${request.url}"`, error)
    return {
        status: 500
    }
  }
}

const handleSuccess = (data: GetReadSummarySucceeded) => {
  return json(200, data)
}

const handleFailures = (err: GetReadSummaryFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'server-error': return json(500, err)
    case 'unexpected-http-exception': return json(500, err)
    case 'unexpected-response-code': return json(500, err)
    case 'not-found': return json(404, err)
    case 'validation-failed': return json(400, err)
    case 'unauthorized': return json(401, err)
    case 'failed-to-acquire-data-lock': return json(401, err)
    default: return assertNever(err)
  }
}
