import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';
import {ensureError} from '../error/ensure-error.js';

export class PromiseTimeoutError extends Error {
    public override readonly name = 'PromiseTimeoutError';

    constructor(
        public readonly durationMs: number,
        public override readonly message: string = `Promised timed out after ${durationMs} ms.`,
    ) {
        super(message);
    }
}

export function wrapPromiseInTimeout<T>(
    duration: Readonly<AnyDuration>,
    originalPromise: PromiseLike<T>,
): Promise<T> {
    const milliseconds = convertDuration(duration, DurationUnit.Milliseconds).milliseconds;

    return new Promise<T>(async (resolve, reject) => {
        const timeoutId =
            milliseconds === Infinity
                ? undefined
                : setTimeout(() => {
                      reject(new PromiseTimeoutError(milliseconds));
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
