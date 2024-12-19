import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever } from '@read-every-word/infrastructure'
import { handleDeleteReadingRecord } from './handler'
import { authenticate, sanitizeAuthId, type JwtPayload } from '../../authentication'

import { DeleteReadingRecord, DeleteReadingRecordSucceeded, DeleteReadingRecordFailed} from '@read-every-word/domain'

app.http('delete_reading_record', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: authenticate(handleEndpoint),
  route: 'readingRecord'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext, token: JwtPayload ): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const body = await request.json() as DeleteReadingRecord

    const result = await handleDeleteReadingRecord({
      ...body,
      authId: sanitizeAuthId(token)
    })

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

const handleSuccess = (data: DeleteReadingRecordSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: DeleteReadingRecordFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'server-error': return json(500, err)
    case 'unexpected-http-exception': return json(500, err)
    case 'unexpected-response-code': return json(500, err)
    case 'not-found': return json(404, err)
    case 'validation-failed': return json(400, err)
    case 'unauthorized': return json(401, err)
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
