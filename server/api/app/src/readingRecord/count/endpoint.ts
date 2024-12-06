import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever } from '@read-every-word/infrastructure'
import { handleCountReadingRecord, type CountReadingRecord, type CountReadingRecordSucceeded, type CountReadingRecordFailed } from './handler'

app.http('get_readingRecord_count', {
  methods: ['GET'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'readingRecord/{readingCycleId}/count'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const getRequest: CountReadingRecord = {
      readingCycleId: request.params.readingCycleId ?? ''
    }

    const result = await handleCountReadingRecord(getRequest)

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

const handleSuccess = (data: CountReadingRecordSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: CountReadingRecordFailed) => {
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
