import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever, json } from '@read-every-word/infrastructure'
import { handleGetUser, type GetUser, type GetUserSucceeded, type GetUserFailed } from './handler'

app.http('get_user', {
  methods: ['GET'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'user/{authId}'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)

    const getRequest: GetUser = {
      authId: request.params.authId ?? ''
    }

    const result = await handleGetUser(getRequest)

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

const handleSuccess = (data: GetUserSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: GetUserFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'validation-failed': return json(400, err)
    case 'user-not-found': return json(404, err)
    default: return assertNever(err)
  }
}
