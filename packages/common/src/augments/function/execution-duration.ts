import {ensureError} from '@augment-vir/core';
import {Duration, DurationUnit} from '@date-vir/duration';

export type ExecutionDuration = Duration<DurationUnit.Milliseconds>;

/**
 * Measures how long (in milliseconds) the given callback takes to run to completion. By default
 * this is synchronous, but it will automatically switch to async and await the callback if it
 * returns a promise.
 *
 * @category Function : Common
 * @example
 *
 * ```ts
 * import {measureExecutionDuration} from '@augment-vir/common';
 *
 * const duration1 = measureExecutionDuration(() => {});
 * const duration2 = await measureExecutionDuration(async () => {});
 * ```
 *
 * @package @augment-vir/common
 */
export function measureExecutionDuration<T>(
    callback: () => T,
): T extends Promise<any> ? Promise<ExecutionDuration> : ExecutionDuration {
    const startTime = Date.now();

    const result = callback();

    if (result instanceof Promise) {
        return new Promise<ExecutionDuration>(async (resolve, reject) => {
            try {
                await result;
                const endTime = Date.now();
                resolve({milliseconds: endTime - startTime});
            } catch (caught) {
                reject(ensureError(caught));
            }
        }) as T extends Promise<any> ? Promise<ExecutionDuration> : ExecutionDuration;
    }

    const endTime = Date.now();
    return {
        milliseconds: endTime - startTime,
    } as T extends Promise<any> ? Promise<ExecutionDuration> : ExecutionDuration;
}
