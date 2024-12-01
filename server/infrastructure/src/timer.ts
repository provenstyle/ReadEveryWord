export const timer = (action: () => void, message?: string): void => {
    const start = performance.now()
    action()
    const end = performance.now()
    const executionTime = end - start

    console.log(`${message ?? 'Executed in'}: ${executionTime.toFixed(2)} milliseconds`)
}

export const asyncTimer = async <T>(action: () => Promise<T>, message?: string, mute?: boolean): Promise<T>  => {
    const start = performance.now()
    const result = await action()
    const end = performance.now()
    const executionTime = end - start
    if (!mute) {
        console.log(`${message ?? 'Executed in'}: ${executionTime.toFixed(2)} milliseconds`)
    }
    return result
}