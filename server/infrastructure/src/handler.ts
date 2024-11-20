export async function handle<T>(func: () => Promise<T>) {
  try {
    return await func().then(() => {
    console.log('')
    console.log('Script completed successfully')
    console.log('')
    })
  } catch (error) {
    process.exitCode = 1
    console.log(error)
    console.log('')
    console.log('Script Failed')
    console.log('')
  }
}