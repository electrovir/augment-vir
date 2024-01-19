import {FalsyTypes} from '../boolean';
import {ensureErrorAndPrependMessage} from '../error';
import {createDeferredPromiseWrapper} from './deferred-promise';

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

export type WaitUntilTruthyOptions = {
    interval: {milliseconds: number};
    timeout: {milliseconds: number};
};

export const defaultWaitUntilDefinedOptions: WaitUntilTruthyOptions = {
    interval: {
        milliseconds: 100,
    },
    timeout: {
        milliseconds: 10_000,
    },
};

/**
 * Runs the predicate until it returns a truthy value, then returns that value. Use the options
 * input to modify the timeout and interval durations. Automatically catches errors and handles
 * async predicates.
 */
export async function waitUntilTruthy<Value>(
    predicate: () => Value | Promise<Value> | FalsyTypes,
    failureMessage?: string | undefined,
    optionsInput: Partial<WaitUntilTruthyOptions> = {},
): Promise<Awaited<Value>> {
    const options: WaitUntilTruthyOptions = {
        ...defaultWaitUntilDefinedOptions,
        ...optionsInput,
    };

    let lastValue: Awaited<Value> | FalsyTypes = undefined;
    let lastError: unknown;
    async function checkCondition() {
        try {
            lastValue = await predicate();
        } catch (error) {
            lastValue = undefined;
            lastError = error;
        }
    }
    const startTime = Date.now();

    while (!lastValue) {
        await checkCondition();
        await wait(options.interval.milliseconds);
        if (Date.now() - startTime >= options.timeout.milliseconds) {
            const message = failureMessage ? `${failureMessage}: ` : '';
            const preMessage = `${message}Timeout of "${options.timeout.milliseconds}" exceeded waiting for value to be defined`;
            if (lastError) {
                throw ensureErrorAndPrependMessage(lastError, preMessage);
            } else {
                throw new Error(preMessage);
            }
        }
    }

    return lastValue;
}
