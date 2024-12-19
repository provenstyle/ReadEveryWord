import { Result, err } from './result'
import { BlobServiceClient, type LeaseOperationResponse, type BlobLeaseClient } from '@azure/storage-blob'

export class FailedToAcquireDataLock {
  code = 'failed-to-acquire-data-lock' as const
  message = 'Could not acquire data lock. Try again.'
  constructor (public data?: any){}
}

// I can see different scenarios
// For user specific locks, I anticipate
// container name being the authId
// I could also see this being a table name
// for whole table locks
// or partitionId for locking partitions within a table
export interface withLockParams<T, E> {
  storageConnectionString: string,
  containerName: string,
  lockFileName: string,
  wait: number,
  func: () => Promise<Result<T, E>>
}

export async function withLock<T, E> (
  params: withLockParams<T, E>
): Promise<Result<T, E | FailedToAcquireDataLock>> {

  const waitTill = Date.now() + params.wait
  let lease: LeaseOperationResponse | undefined
  let blobLeaseClient: BlobLeaseClient | undefined

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(params.storageConnectionString)

    const containerClient = blobServiceClient.getContainerClient(params.containerName)
    if (!(await containerClient.exists())) {
      await containerClient.create()
    }

    const blobClient = containerClient.getBlockBlobClient(`${params.lockFileName}`)
    if (!(await blobClient.exists())) {
      const content = 'lock file'
      await blobClient.upload(content, Buffer.byteLength(content))
    }

    blobLeaseClient = blobClient.getBlobLeaseClient()

    while (Date.now() < waitTill) {
      try {
        lease = await blobLeaseClient.acquireLease(60)
        const executionResult = await params.func()
        return executionResult
      } catch (e) {
        if (e.code !== 'LeaseAlreadyPresent') {
          throw e
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return err(new FailedToAcquireDataLock())
  } finally {
    if (lease?.leaseId && blobLeaseClient) {
      await blobLeaseClient.releaseLease()
    }
  }
}
