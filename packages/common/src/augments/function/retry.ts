import {type PartialWithUndefined} from '@augment-vir/common';
import {ensureErrorAndPrependMessage, wait} from '@augment-vir/core';
import {type AtLeastOneDuration} from '@date-vir/duration';
import {type IsEqual} from 'type-fest';

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
export function retry<const T, const Duration extends AtLeastOneDuration | undefined = undefined>(
    maxRetries: number,
    callback: () => T,
    options: PartialWithUndefined<{
        /**
         * Wait this duration between each retry.
         *
         * @default {seconds: 1}
         */
        interval: Duration;
    }> = {},
): IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>> {
    try {
        const result = callback();

        if (result instanceof Promise) {
            return result.catch(async (error: unknown) => {
                if (maxRetries <= 1) {
                    throw ensureErrorAndPrependMessage(error, 'Retry max reached');
                } else {
                    if (options.interval) {
                        await wait(options.interval);
                    }
                    return retry(maxRetries - 1, callback, options);
                }
            }) as IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>>;
        } else {
            return result as IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>>;
        }
    } catch (error) {
        if (maxRetries <= 1) {
            throw ensureErrorAndPrependMessage(error, 'Retry max reached');
        } else if (options.interval) {
            return wait(options.interval).then(() =>
                retry(maxRetries - 1, callback, options),
            ) as IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>>;
        } else {
            return retry(maxRetries - 1, callback, options);
        }
    }
}
