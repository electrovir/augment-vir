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
