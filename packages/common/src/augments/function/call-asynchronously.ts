import {MaybePromise} from '@augment-vir/core';

/**
 * Call a function asynchronously without interrupting current synchronous execution, even if the
 * function was originally synchronous.
 *
 * @example
 *
 * ```ts
 * import {callAsynchronously} from '@augment-vir/common';
 *
 * console.info('1');
 * const later = callAsynchronously(() => {
 *     console.info('3');
 * });
 * console.info('2');
 * await later;
 *
 * // logs 1,2,3 in numeric order
 * ```
 *
 * @package @augment-vir/common
 */
export async function callAsynchronously<T>(callback: () => MaybePromise<T>) {
    return await Promise.resolve().then(() => callback());
}
