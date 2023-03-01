import {extractErrorMessage} from './error';
import {typedHasProperty} from './object/typed-has-property';

export function wait(delayMs: number): Promise<void> {
    const deferredPromiseWrapper = createDeferredPromiseWrapper();

    if (delayMs !== Infinity) {
        setTimeout(
            () => {
                deferredPromiseWrapper.resolve();
            },
            delayMs <= 0 ? 0 : delayMs,
        );
    }

    return deferredPromiseWrapper.promise;
}

export async function waitValue<ResolutionValue>(
    delayMs: number,
    returnValue: ResolutionValue,
): Promise<ResolutionValue> {
    return wait(delayMs).then(() => returnValue);
}

export function isPromiseLike<T>(
    input: T | unknown,
): input is T extends PromiseLike<infer ValueType> ? PromiseLike<ValueType> : PromiseLike<unknown> {
    if (typedHasProperty(input, 'then') && typeof input.then === 'function') {
        return true;
    } else {
        return false;
    }
}

export type UnPromise<T> = T extends PromiseLike<infer PromiseType> ? Awaited<PromiseType> : T;

export type MaybePromise<T> = Promise<UnPromise<T>> | UnPromise<T>;

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

/** A promise which can be resolved or rejected by external code. */
export type DeferredPromiseWrapper<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    isSettled: () => boolean;
};

export function createDeferredPromiseWrapper<T = void>(): DeferredPromiseWrapper<T> {
    let resolve: DeferredPromiseWrapper<T>['resolve'] | undefined;
    let reject: DeferredPromiseWrapper<T>['reject'] | undefined;

    let settled = false;

    const promise = new Promise<T>((resolveCallback, rejectCallback) => {
        resolve = (value: any) => {
            settled = true;
            return resolveCallback(value);
        };
        reject = (reason) => {
            settled = true;
            rejectCallback(reason);
        };
    });

    // no way to test this edge case
    // istanbul ignore next
    if (!resolve || !reject) {
        throw new Error(
            `Reject and resolve callbacks were not set by the promise constructor for ${createDeferredPromiseWrapper.name}.`,
        );
    }

    return {
        promise,
        resolve,
        reject,
        isSettled() {
            return settled;
        },
    };
}

export type WaitForConditionInputs = {
    conditionCallback: () => boolean | Promise<boolean>;
    timeoutMs?: number;
    intervalMs?: number;
    timeoutMessage?: string;
};

export async function waitForCondition({
    conditionCallback,
    timeoutMs = 10000,
    intervalMs = 100,
    timeoutMessage = '',
}: WaitForConditionInputs): Promise<void> {
    let condition: boolean = false;
    let lastError: unknown;
    async function checkCondition() {
        try {
            condition = !!(await conditionCallback());
        } catch (error) {
            condition = false;
            lastError = error;
        }
    }
    const startTime = Date.now();
    await checkCondition();

    while (!condition) {
        await wait(intervalMs);
        if (Date.now() - startTime >= timeoutMs) {
            const message = timeoutMessage ? `${timeoutMessage}: ` : '';
            throw new Error(
                `${message}Timeout of "${timeoutMs}" exceeded waiting for condition to be true${extractErrorMessage(
                    lastError,
                )}`,
            );
        }
        await checkCondition();
    }
}
