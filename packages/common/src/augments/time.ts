/**
 * Measures how long (in milliseconds) the given callback takes to run to completion. Automatically
 * switches to async mode and awaits callbacks if they return a promise (otherwise this function is
 * purely synchronous).
 */
export function timeCallback<T>(
    callback: () => T,
): T extends Promise<any> ? Promise<number> : number {
    const startTime = Date.now();

    const result = callback();

    if (result instanceof Promise) {
        return new Promise<number>(async (resolve, reject) => {
            try {
                await result;
                const endTime = Date.now();
                resolve(endTime - startTime);
            } catch (caught) {
                reject(caught);
            }
        }) as T extends Promise<any> ? Promise<number> : number;
    }

    const endTime = Date.now();
    return (endTime - startTime) as T extends Promise<any> ? Promise<number> : number;
}

/**
 * Measures how long (in milliseconds) the given callback takes to run to completion. Automatically
 * switches to async mode and awaits callbacks if they return a promise (otherwise this function is
 * purely synchronous).
 *
 * Alias of timeCallback.
 */
export const measureCallbackDuration = timeCallback;
