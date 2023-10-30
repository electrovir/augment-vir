import {typedHasProperty} from '../object/typed-has-property';

export function isPromiseLike<T>(
    input: T | unknown,
): input is T extends PromiseLike<infer ValueType> ? PromiseLike<ValueType> : PromiseLike<unknown> {
    if (typedHasProperty(input, 'then') && typeof input.then === 'function') {
        return true;
    } else {
        return false;
    }
}

export type MaybePromise<T> = Promise<T> | T;

export class PromiseTimeoutError extends Error {
    public override readonly name = 'PromiseTimeoutError';

    constructor(
        public readonly durationMs: number,
        public override readonly message: string = `Promised timed out after ${durationMs} ms.`,
    ) {
        super(message);
    }
}

export function wrapPromiseInTimeout<PromiseValueType>(
    durationMs: number,
    originalPromise: PromiseLike<PromiseValueType>,
): Promise<PromiseValueType> {
    return new Promise<PromiseValueType>(async (resolve, reject) => {
        const timeoutId =
            durationMs === Infinity
                ? undefined
                : setTimeout(() => {
                      reject(new PromiseTimeoutError(durationMs));
                  }, durationMs);
        try {
            const result = await originalPromise;
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            clearTimeout(timeoutId);
        }
    });
}

/**
 * Call a function asynchronously without interrupting current synchronous execution, even if the
 * function was originally synchronous.
 */
export async function callAsynchronously<T>(callback: () => MaybePromise<T>) {
    return await Promise.resolve().then(() => callback());
}

export async function executeWithRetries<T>(retryCount: number, callback: () => T): Promise<T> {
    let currentRetry = 0;
    while (currentRetry < retryCount) {
        try {
            const result = await callback();
            return result;
        } catch (error) {
            currentRetry++;
        }
    }
    throw new Error('Retry max reached.');
}
