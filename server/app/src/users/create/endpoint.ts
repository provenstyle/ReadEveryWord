import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { isOk, assertNever } from '../../infrastructure/Result'
import { handleCreateUser, type CreateUser, type CreateUserSucceeded, type CreateUserFailed } from './handler'

app.http('create_user', {
  methods: ['POST'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'user'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`Http request for url "${request.url}"`)

    const body = await request.json() as CreateUser

    const result = await handleCreateUser(body)

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

const handleSuccess = (data: CreateUserSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: CreateUserFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'validation-failed': return json(400, err)
    case 'duplicate-auth-id': return json(400, err)
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
