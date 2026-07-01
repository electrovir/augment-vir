import {type PartialWithUndefined} from '@augment-vir/common';
import {ensureErrorAndPrependMessage, wait} from '@augment-vir/core';
import {type AtLeastOneDuration} from '@date-vir/duration';
import {type IsEqual} from 'type-fest';

/**
 * Params for the callback passed to {@link retry}.
 *
 * @category Internal
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RetryCallbackParams = {
    /** This will be `0` for the first execution, then increment with each retry. */
    retryCount: number;
    /** Only true on the last retry. */
    isLastRetry: boolean;
    /** Only true on the first execution, before any retries. */
    isFirstExecution: boolean;
    /** Only true on the first retry. */
    isFirstRetry: boolean;
};

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
    callback: (params: RetryCallbackParams) => T,
    options: PartialWithUndefined<{
        /**
         * Wait this duration between each retry.
         *
         * @default {seconds: 1}
         */
        interval: Duration;
    }> = {},
): IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>> {
    return internalRetry({
        currentRetry: 0,
        maxRetries,
        callback,
        options,
    });
}

function internalRetry<const T, const Duration extends AtLeastOneDuration | undefined = undefined>({
    currentRetry,
    maxRetries,
    callback,
    options = {},
}: Readonly<{
    currentRetry: number;
    maxRetries: number;
    callback: (params: RetryCallbackParams) => T;
    options?: PartialWithUndefined<{
        /**
         * Wait this duration between each retry.
         *
         * @default {seconds: 1}
         */
        interval: Duration;
    }>;
}>): IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>> {
    try {
        const result = callback({
            retryCount: currentRetry,
            isFirstExecution: currentRetry === 0,
            isFirstRetry: currentRetry === 1,
            isLastRetry: currentRetry === maxRetries,
        });

        if (result instanceof Promise) {
            return result.catch(async (error: unknown) => {
                if (currentRetry >= maxRetries) {
                    throw ensureErrorAndPrependMessage(error, 'Retry max reached');
                } else {
                    if (options.interval) {
                        await wait(options.interval);
                    }
                    return internalRetry({
                        currentRetry: currentRetry + 1,
                        maxRetries,
                        callback,
                        options,
                    });
                }
            }) as IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>>;
        } else {
            return result as IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>>;
        }
    } catch (error) {
        if (currentRetry >= maxRetries) {
            throw ensureErrorAndPrependMessage(error, 'Retry max reached');
        } else if (options.interval) {
            return wait(options.interval).then(() =>
                internalRetry({
                    currentRetry: currentRetry + 1,
                    maxRetries,
                    callback,
                    options,
                }),
            ) as IsEqual<Duration, undefined> extends true ? T : Promise<Awaited<T>>;
        } else {
            return internalRetry({
                currentRetry: currentRetry + 1,
                maxRetries,
                callback,
                options,
            });
        }
    }
}
