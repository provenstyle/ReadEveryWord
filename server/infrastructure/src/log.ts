export function logAxiosError (e: any, uri: string) {
  if (e.code) {
    console.log(`Error code: ${e.code}`)
    if (e.code === 'ECONNREFUSED') {
      console.log('Try using 127.0.0.1 instead of localhost if working locally')
    }
  }
  if (e.response) {
    console.log(`Request to: ${uri}`)
    console.log(`Returned status: ${e.response?.status}`)
    console.log(`Message: ${e.response?.data?.message}`)
    console.log(`Failures: ${JSON.stringify(e.response?.data?.failures)})`)
  }
  if (!e.code && !e.response) {
    console.log('Non-Axios Error Thrown')
    console.log(e)
  }
}