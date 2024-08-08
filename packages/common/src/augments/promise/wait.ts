import {DeferredPromise} from './deferred-promise.js';

export function wait(delayMs: number): Promise<void> {
    const deferredPromise = new DeferredPromise();

    if (delayMs !== Infinity) {
        setTimeout(
            () => {
                deferredPromise.resolve();
            },
            delayMs <= 0 ? 0 : delayMs,
        );
    }

    return deferredPromise.promise;
}

export async function waitValue<ResolutionValue>(
    delayMs: number,
    returnValue: ResolutionValue,
): Promise<ResolutionValue> {
    return wait(delayMs).then(() => returnValue);
}
