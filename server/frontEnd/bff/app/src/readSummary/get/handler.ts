import { isErr } from '@read-every-word/infrastructure'
import { GetReadSummary, GetReadSummaryResult } from '@read-every-word/domain'
import { Client, fromEnv} from '@read-every-word/client'

export async function handleGetReadSummary(request: GetReadSummary): Promise<GetReadSummaryResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data

  const client = new Client(config.service)

  return await client.readSummary.get(request)
}
