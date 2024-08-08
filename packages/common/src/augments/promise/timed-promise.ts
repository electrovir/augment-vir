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
    durationMs: number,
    originalPromise: PromiseLike<T>,
): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
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
            reject(ensureError(error));
        } finally {
            clearTimeout(timeoutId);
        }
    });
}
