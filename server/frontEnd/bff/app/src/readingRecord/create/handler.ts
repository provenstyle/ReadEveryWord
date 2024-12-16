import { isErr } from '@read-every-word/infrastructure'
import { Client, fromEnv } from '@read-every-word/client'
import { CreateReadingRecord, CreateReadingRecordResult} from '@read-every-word/domain'

export async function handleCreateReadingRecord(request: CreateReadingRecord): Promise<CreateReadingRecordResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data

  const client = new Client(config.service)

  return await client.readingRecord.create(request)
}

