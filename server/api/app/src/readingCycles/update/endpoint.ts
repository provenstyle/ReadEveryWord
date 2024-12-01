import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever } from '../../infrastructure/Result'
import { handleUpdateReadingCycle, type UpdateReadingCycle, type UpdateReadingCycleSucceeded, type UpdateReadingCycleFailed } from './handler'

app.http('update_readingCycle', {
  methods: ['PATCH'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'readingCycle'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const body = await request.json() as UpdateReadingCycle

    const result = await handleUpdateReadingCycle(body)

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

const handleSuccess = (data: UpdateReadingCycleSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: UpdateReadingCycleFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'validation-failed': return json(400, err)
    case 'row-not-found-error': return json(404, err)
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
