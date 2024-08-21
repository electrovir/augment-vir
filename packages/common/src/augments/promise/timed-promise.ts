import {check} from '@augment-vir/assert';
import {ensureError} from '@augment-vir/core';
import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';

export class PromiseTimeoutError extends Error {
    public override readonly name = 'PromiseTimeoutError';

    constructor(
        public readonly duration: AnyDuration,
        failureMessage?: string | undefined,
    ) {
        super(
            [
                failureMessage,
                `Promised timed out after ${convertDuration(duration, DurationUnit.Milliseconds).milliseconds} ms.`,
            ]
                .filter(check.isTruthy)
                .join(': '),
        );
    }
}

export function wrapPromiseInTimeout<T>(
    duration: Readonly<AnyDuration>,
    originalPromise: PromiseLike<T>,
    failureMessage?: string | undefined,
): Promise<T> {
    const milliseconds = convertDuration(duration, DurationUnit.Milliseconds).milliseconds;

    return new Promise<T>(async (resolve, reject) => {
        const timeoutId =
            milliseconds === Infinity
                ? undefined
                : setTimeout(() => {
                      reject(new PromiseTimeoutError(duration, failureMessage));
                  }, milliseconds);
        try {
            const result = await originalPromise;
            resolve(result);
        } catch (error) {
            reject(ensureError(error));
        } finally {
            clearTimeout(timeoutId);
        }
    });
}
