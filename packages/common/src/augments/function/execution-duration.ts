import {ensureError} from '../error/ensure-error.js';

/**
 * Measures how long (in milliseconds) the given callback takes to run to completion. Automatically
 * switches to async mode and awaits callbacks if they return a promise (otherwise this function is
 * purely synchronous).
 */
export function measureExecutionDuration<T>(
    callback: () => T,
): T extends Promise<any> ? Promise<{milliseconds: number}> : {milliseconds: number} {
    const startTime = Date.now();

    const result = callback();

    if (result instanceof Promise) {
        return new Promise<{milliseconds: number}>(async (resolve, reject) => {
            try {
                await result;
                const endTime = Date.now();
                resolve({milliseconds: endTime - startTime});
            } catch (caught) {
                reject(ensureError(caught));
            }
        }) as T extends Promise<any> ? Promise<{milliseconds: number}> : {milliseconds: number};
    }

    const endTime = Date.now();
    return {
        milliseconds: endTime - startTime,
    } as T extends Promise<any> ? Promise<{milliseconds: number}> : {milliseconds: number};
}
