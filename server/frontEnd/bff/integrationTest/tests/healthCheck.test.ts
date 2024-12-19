import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/bff'
import { withBaseUrl, withAuthToken } from './scenarios'

describe('healthCheck', () => {
    const healthCheckClient = new Client(withBaseUrl(), withAuthToken).healthCheck

    it('health check is successful', async () => {
      const healthCheckResult = await healthCheckClient.get()
      const healthCheck = expectOk(healthCheckResult)
      expect(healthCheck.length).toEqual(2)
      expect(healthCheck[0].name).toEqual("Read Every Word Api")
      expect(healthCheck[0].configured).toEqual(true)
      expect(healthCheck[1].name).toEqual("Read Every Word BFF")
      expect(healthCheck[1].configured).toEqual(true)
    })
})

