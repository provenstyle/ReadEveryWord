import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever } from '@read-every-word/infrastructure'
import { handleCreateReadingRecord, type CreateReadingRecord, type CreateReadingRecordSucceeded, type CreateReadingRecordFailed } from './handler'

app.http('create_readingRecord', {
  methods: ['POST'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'readingRecord'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const body = await request.json() as CreateReadingRecord

    const result = await handleCreateReadingRecord(body)

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

const handleSuccess = (data: CreateReadingRecordSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: CreateReadingRecordFailed) => {
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
