import {type MaybePromise} from '@augment-vir/core';
import {type AnyDuration, convertDuration} from '@date-vir/duration';

/**
 * Creates an interval that prevents multiple parallel executions. If the previous callback
 * execution is still executing, the next one will not fire.
 *
 * @category Interval
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function createBlockingInterval(callback: () => MaybePromise<void>, interval: AnyDuration) {
    let isExecuting = false;

    const intervalId = globalThis.setInterval(
        async () => {
            if (isExecuting) {
                return;
            }

            isExecuting = true;

            try {
                await callback();
            } finally {
                isExecuting = false;
            }
        },
        convertDuration(interval, {
            milliseconds: true,
        }).milliseconds,
    );

    return {
        intervalId,
        clearInterval(this: void) {
            globalThis.clearInterval(intervalId);
        },
    };
}
