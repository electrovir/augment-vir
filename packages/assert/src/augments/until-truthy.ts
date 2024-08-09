import {ensureErrorAndPrependMessage, FalsyTypes, wait} from '@augment-vir/common';
import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';

export type WaitUntilTruthyOptions = {
    interval: AnyDuration;
    timeout: AnyDuration;
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
export async function untilTruthy<Value>(
    predicate: () => Value | Promise<Value> | FalsyTypes,
    failureMessage?: string | undefined,
    optionsInput: Partial<WaitUntilTruthyOptions> = {},
): Promise<Awaited<Value>> {
    const options: WaitUntilTruthyOptions = {
        ...defaultWaitUntilDefinedOptions,
        ...optionsInput,
    };

    const timeout = convertDuration(options.timeout, DurationUnit.Milliseconds).milliseconds;
    const interval = convertDuration(options.interval, DurationUnit.Milliseconds).milliseconds;

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
        await wait(interval);
        if (Date.now() - startTime >= timeout) {
            const message = failureMessage ? `${failureMessage}: ` : '';
            const preMessage = `${message}Timeout of "${timeout}" milliseconds exceeded waiting for value to be defined`;
            if (lastError) {
                throw ensureErrorAndPrependMessage(lastError, preMessage);
            } else {
                throw new Error(preMessage);
            }
        }
    }

    return lastValue;
}
