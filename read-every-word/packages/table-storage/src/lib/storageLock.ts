import { Result, err } from '@read-every-word/foundation'
import { BlobServiceClient, type LeaseOperationResponse, type BlobLeaseClient, RestError } from '@azure/storage-blob'

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
      try {
        await containerClient.create()
      } catch (e: unknown) {
        // Handle race condition: if container was created by another concurrent request, ignore the error
        // Error code 409 (Conflict) with message about container already existing
        if (e instanceof RestError && e.statusCode === 409 && e.message?.includes('already exists')) {
          // Container already exists, which is fine - another concurrent request created it
        } else {
          return err(new FailedToAcquireDataLock('Unexpected error creating storage container'))
        }
      }
    }

    const blobClient = containerClient.getBlockBlobClient(`${params.lockFileName}`)
    if (!(await blobClient.exists())) {
      try {
        const content = 'lock file'
        await blobClient.upload(content, Buffer.byteLength(content))
      } catch (e: unknown) {
        // Handle race condition: if blob was created by another concurrent request, ignore the error
        // Error code 409 (Conflict) means the blob already exists
        // Error code 412 (PreconditionFailed/LeaseIdMissing) means the blob exists and has a lease
        // Both are fine - the blob exists, and we'll try to acquire a lease in the next step
        if (e instanceof RestError && (e.statusCode === 409 || e.statusCode === 412)) {
          // Blob already exists (possibly with a lease), which is fine - another concurrent request created it
        } else {
          return err(new FailedToAcquireDataLock('Unexpected error creating lock file'))
        }
      }
    }

    blobLeaseClient = blobClient.getBlobLeaseClient()

    while (Date.now() < waitTill) {
      try {
        lease = await blobLeaseClient.acquireLease(60)
        const executionResult = await params.func()
        return executionResult
      } catch (e: any) {
        if (e?.code !== 'LeaseAlreadyPresent') {
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
