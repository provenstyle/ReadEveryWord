import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever } from '@read-every-word/infrastructure'
import { handleGetSummary, type GetSummary, type GetSummarySucceeded, type GetSummaryFailed } from './handler'

app.http('get_bff_summary', {
  methods: ['GET'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'bff/summary/{authId}'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const getRequest: GetSummary = {
      authId: request.params.authId ?? ''
    }

    const result = await handleGetSummary(getRequest)

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

const handleSuccess = (data: GetSummarySucceeded) => {
  return json(200, data)
}

const handleFailures = (err: GetSummaryFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'validation-failed': return json(400, err)
    case 'user-not-found': return json(404, err)
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
