import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { assertNever, isOk, json } from '@read-every-word/infrastructure'
import { GetHealthCheckSucceeded, GetHealthCheckFailed } from '@read-every-word/domain'
import { authenticate, type JwtPayload } from '../authentication'
import { handleGetHealthCheck } from './handler'

const env = process.env.KEEP_WARM
const keepWarm = env?.toLowerCase() === 'true'

if (keepWarm) {
  console.log('Keep warm is enabled.')
  app.timer('keep_warm_timer', {
    schedule: '0 * * * * *',
    handler: async () => {
      await handleGetHealthCheck({})
    }
  })
}

app.http('health_check', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authenticate(handleEndpoint),
  route: 'healthCheck'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext, jwt: JwtPayload): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)
    const result = await handleGetHealthCheck({})

    return isOk(result)
      ? handleSuccess(result.data)
      : handleFailures(result.err)

  } catch (error) {
    console.error(`Error handling "${request.url}"`, error)
    return ({ status: 500 })
  }
}

const handleSuccess = (data: GetHealthCheckSucceeded) => {
  return json(200, data)
}

const handleFailures = (err: GetHealthCheckFailed) => {
  switch (err.code) {
    case 'invalid-server-configuration': return json(500, err)
    case 'unexpected-http-exception': return json(500, err)
    case 'unexpected-response-code': return json(500, err)
    case 'persistence-error': return json(500, err)
    case 'server-error': return json(500, err)
    case 'validation-failed': return json(400, err)
    case 'not-found': return json(404, err)
    case 'unauthorized': return json(401, err)
    default: return assertNever(err)
  }
}
