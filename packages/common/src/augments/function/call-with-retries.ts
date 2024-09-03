import {ensureErrorAndPrependMessage} from '@augment-vir/core';

/**
 * Calls `callback` until it doesn't throw an error or throws an error when `maxRetries` is reached.
 * Similar to the `waitUntil` guard from '@augment-vir/assert' but doesn't check the callback's
 * output.
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {callWithRetries} from '@augment-vir/common';
 *
 * const result = callWithRetries(5, () => {
 *     if (Math.random() < 0.5) {
 *         return 'done';
 *     } else {
 *         throw new Error();
 *     }
 * });
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function callWithRetries<const T>(maxRetries: number, callback: () => T): T {
    try {
        const result = callback();

        if (result instanceof Promise) {
            return result.catch((error: unknown) => {
                if (maxRetries <= 1) {
                    throw ensureErrorAndPrependMessage(error, 'Retry max reached');
                } else {
                    return callWithRetries(maxRetries - 1, callback);
                }
            }) as T;
        } else {
            return result;
        }
    } catch (error) {
        if (maxRetries <= 1) {
            throw ensureErrorAndPrependMessage(error, 'Retry max reached');
        } else {
            return callWithRetries(maxRetries - 1, callback);
        }
    }
}
