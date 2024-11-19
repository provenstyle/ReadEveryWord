export const timer = (action: () => void, message?: string): void => {
    const start = performance.now();
    action();
    const end = performance.now();
    const executionTime = end - start;

    console.log(`${message ?? 'Executed in'}: ${executionTime.toFixed(2)} milliseconds`);
}