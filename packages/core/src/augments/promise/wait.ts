import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';
import {DeferredPromise} from './deferred-promise.js';

export function wait(duration: Readonly<AnyDuration>): Promise<void> {
    const deferredPromise = new DeferredPromise();
    const milliseconds = convertDuration(duration, DurationUnit.Milliseconds).milliseconds;

    if (milliseconds !== Infinity) {
        setTimeout(
            () => {
                deferredPromise.resolve();
            },
            milliseconds <= 0 ? 0 : milliseconds,
        );
    }

    return deferredPromise.promise;
}

export async function waitValue<Value>(
    duration: Readonly<AnyDuration>,
    value: Value,
): Promise<Value> {
    await wait(duration);

    return value;
}
