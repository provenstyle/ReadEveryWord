import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever } from '@read-every-word/infrastructure'
import { handleSetDefaultReadingCycle, type SetDefaultReadingCycleSucceeded, type SetDefaultReadingCycleFailed } from './handler'
import { type SetDefaultReadingCycle } from '../domain'

app.http('set_default_readingCycle', {
  methods: ['POST'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'readingCycle/default'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const body = await request.json() as SetDefaultReadingCycle

    const result = await handleSetDefaultReadingCycle(body)

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

const handleSuccess = (data: SetDefaultReadingCycleSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: SetDefaultReadingCycleFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'server-error': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'unexpected-http-exception': return json(500, err)
    case 'unexpected-response-code': return json(500, err)
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
