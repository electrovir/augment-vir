import type {
    AnyFunction,
    AnyObject,
    MaybePromise,
    NarrowToExpected,
    PartialWithUndefined,
    RemoveFirstTupleEntry,
    RemoveLastTupleEntry,
    RequiredAndNotNull,
} from '@augment-vir/core';
import {ensureError, ensureErrorAndPrependMessage, wait} from '@augment-vir/core';
import {type AnyDuration, convertDuration} from '@date-vir/duration';
import type {AssertFunction} from './assert-function.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {AssertionError} from '../augments/assertion.error.js';

/**
 * Options for configuring the timing of `waitUntil`.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export type WaitUntilOptions = PartialWithUndefined<{
    /**
     * The duration between attempts.
     *
     * @default {milliseconds: 100}
     */
    interval: AnyDuration;
    /**
     * The maximum duration to keep trying. If the `waitUntil` expectations are still not met by
     * this time, an {@link AssertionError} will be thrown.
     *
     * @default {seconds: 10}
     */
    timeout: AnyDuration;
}>;

export const defaultWaitUntilOptions: RequiredAndNotNull<WaitUntilOptions> = {
    interval: {
        milliseconds: 100,
    },
    timeout: {
        seconds: 10,
    },
};

const notSetSymbol = Symbol('not set');

export async function executeWaitUntil<const Assert extends AssertFunction<any>>(
    this: void,
    assert: AssertFunction<any>,
    rawArgs: unknown[],
    requireSynchronousResult: boolean,
) {
    const {callback, extraAssertionArgs, failureMessage, options} = parseWaitUntilArgs(rawArgs);

    const timeout = convertDuration(options.timeout, {milliseconds: true}).milliseconds;
    const interval = convertDuration(options.interval, {milliseconds: true});

    let lastCallbackOutput: unknown = notSetSymbol;
    let lastError: Error | undefined = undefined;
    async function checkCondition() {
        try {
            lastCallbackOutput = requireSynchronousResult ? callback() : await callback();
            assert(lastCallbackOutput, ...extraAssertionArgs);
        } catch (error) {
            lastCallbackOutput = notSetSymbol;
            lastError = ensureError(error);
        }
    }
    const startTime = Date.now();

    while (lastCallbackOutput === notSetSymbol) {
        await checkCondition();
        await wait(interval);
        if (Date.now() - startTime >= timeout) {
            const message = failureMessage ? `${failureMessage}: ` : '';
            const preMessage = `${message}Timeout of '${timeout}' milliseconds exceeded waiting for callback value to match expectations`;
            throw ensureErrorAndPrependMessage(lastError, preMessage);
        }
    }

    return lastCallbackOutput as ReturnType<WaitUntilFunction<Assert>>;
}

export type WaitUntilOverridesBase<Keys extends PropertyKey = string> = Readonly<
    Partial<Record<Keys, AnyFunction | undefined>>
>;

export type WaitUntilFunctionParameters<Assert extends AssertFunction<any>, Input> = [
    ...RemoveFirstTupleEntry<RemoveLastTupleEntry<Parameters<Assert>>>,
    () => MaybePromise<Input>,
];

export type WaitUntilFunction<Assert extends AssertFunction<any>> =
    Assert extends AssertFunction<infer Guard>
        ? <Input extends Parameters<Assert>[0]>(
              this: void,
              ...params: [
                  ...WaitUntilFunctionParameters<Assert, Input>,
                  options?: WaitUntilOptions | undefined,
                  failureMessage?: string | undefined,
              ]
          ) => Promise<NarrowToExpected<Input, Guard>>
        : never;

export function createWaitUntil<const Assert extends AssertFunction<any>>(
    assert: Assert,
    requireSynchronousResult = false,
) {
    return ((...rawArgs: unknown[]) => {
        return executeWaitUntil(assert, rawArgs, requireSynchronousResult);
    }) as AnyFunction as WaitUntilFunction<Assert>;
}

export function parseWaitUntilArgs(rawArgs: unknown[]) {
    const args: {
        extraAssertionArgs: unknown[];
        callback?: AnyFunction;
        options: AnyObject | undefined;
        failureMessage: string | undefined;
    } = {
        extraAssertionArgs: [],
        options: undefined,
        failureMessage: undefined,
    };

    rawArgs.toReversed().forEach((arg) => {
        if (args.callback) {
            args.extraAssertionArgs.push(arg);
        } else if (typeof arg === 'function') {
            args.callback = arg as AnyFunction;
        } else if (typeof arg === 'string') {
            args.failureMessage = arg;
        } else if (typeof arg === 'object') {
            args.options = arg as AnyObject;
        } else if (arg === undefined) {
            /** Skip an undefined arg. */
            return;
        } else {
            throw new TypeError(`Unexpected waitUntil arg: ${JSON.stringify(arg)}`);
        }
    });

    if (!args.callback) {
        throw new TypeError('Missing waitUntil callback.');
    }

    return {
        callback: args.callback,
        options: parseWaitUntilOptions(args.options),
        extraAssertionArgs: args.extraAssertionArgs.toReversed(),
        failureMessage: args.failureMessage,
    };
}

export function parseWaitUntilOptions(
    rawOptions: WaitUntilOptions | undefined,
): RequiredAndNotNull<WaitUntilOptions> {
    return {
        interval: rawOptions?.interval || defaultWaitUntilOptions.interval,
        timeout: rawOptions?.timeout || defaultWaitUntilOptions.timeout,
    };
}
