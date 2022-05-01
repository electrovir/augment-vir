export function wait(delayMs: number): Promise<void> {
    const deferredPromiseWrapper = createDeferredPromiseWrapper();

    if (delayMs === Infinity || delayMs < 0) {
        return deferredPromiseWrapper.promise;
    }

    setTimeout(() => {
        deferredPromiseWrapper.resolve();
    }, delayMs);

    return deferredPromiseWrapper.promise;
}

export function isPromiseLike(input: any): input is PromiseLike<unknown> {
    if (typeof input?.then === 'function') {
        return true;
    } else {
        return false;
    }
}

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
        const timeoutId = setTimeout(() => {
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

/** A promise which can be resolved or rejected by external code. */
export type DeferredPromiseWrapper<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};

export function createDeferredPromiseWrapper<T = void>(): DeferredPromiseWrapper<T> {
    let resolve: DeferredPromiseWrapper<T>['resolve'] | undefined;
    let reject: DeferredPromiseWrapper<T>['reject'] | undefined;

    const promise = new Promise<T>((resolveCallback, rejectCallback) => {
        resolve = resolveCallback;
        reject = rejectCallback;
    });

    if (!resolve || !reject) {
        throw new Error(
            `Reject and resolve callbacks were not set by the promise constructor for ${createDeferredPromiseWrapper.name}.`,
        );
    }

    return {
        promise,
        resolve,
        reject,
    };
}
