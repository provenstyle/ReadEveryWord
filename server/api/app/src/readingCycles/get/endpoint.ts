import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever } from '../../infrastructure/Result'
import { handleGetReadingCycle, type GetReadingCycle, type GetReadingCycleSucceeded, type GetReadingCycleFailed } from './handler'

app.http('get_readingCycle', {
  methods: ['GET'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'readingCycle/{authId}'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const getRequest: GetReadingCycle = {
      authId: request.params.authId ?? ''
    }

    const result = await handleGetReadingCycle(getRequest)

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

const handleSuccess = (data: GetReadingCycleSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: GetReadingCycleFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'validation-failed': return json(400, err)
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
