import {ensureErrorAndPrependMessage, MaybePromise} from '@augment-vir/core';

export function callWithRetries<const T>(
    maxRetries: number,
    callback: () => Promise<T>,
): Promise<T>;
export function callWithRetries<const T>(maxRetries: number, callback: () => T): T;
export function callWithRetries<const T>(
    maxRetries: number,
    callback: () => MaybePromise<T>,
): MaybePromise<T>;
export function callWithRetries<const T>(
    maxRetries: number,
    callback: () => MaybePromise<T>,
): MaybePromise<T> {
    try {
        const result = callback();

        if (result instanceof Promise) {
            return result.catch((error: unknown) => {
                if (maxRetries <= 1) {
                    throw ensureErrorAndPrependMessage(error, 'Retry max reached');
                } else {
                    return callWithRetries(maxRetries - 1, callback);
                }
            });
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
