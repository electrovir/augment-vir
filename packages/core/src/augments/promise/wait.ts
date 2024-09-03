import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';
import {DeferredPromise} from './deferred-promise.js';

/**
 * An async pause for the given duration.
 *
 * @category Promise : Common
 * @package @augment-vir/common
 * @see
 * - {@link waitValue} : return a value after the wait finishes.
 */
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

/**
 * An async pause for the given duration that then returns the given `value`.
 *
 * @category Promise : Common
 * @package @augment-vir/common
 * @see
 * - {@link wait} : plain wait.
 */
export async function waitValue<Value>(
    duration: Readonly<AnyDuration>,
    value: Value,
): Promise<Value> {
    await wait(duration);

    return value;
}
