import { isErr } from '@read-every-word/infrastructure'
import { Client, fromEnv } from '@read-every-word/client'
import { DeleteReadingRecord, DeleteReadingRecordResult } from '@read-every-word/domain'

export async function handleDeleteReadingRecord(request: DeleteReadingRecord): Promise<DeleteReadingRecordResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data
  const client = new Client(config.service)

  return await client.readingRecord.delete(request)
}
