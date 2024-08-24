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
import {
    ensureError,
    ensureErrorAndPrependMessage,
    ExtractKeysWithMatchingValues,
    Overwrite,
    wait,
} from '@augment-vir/core';
import {AnyDuration, convertDuration, DurationUnit} from '@date-vir/duration';
import type {AssertFunction} from '../guard-types/assert-function.js';
import {pickOverride} from './guard-override.js';

export type WaitUntilOptions = PartialWithUndefined<{
    /** @default {milliseconds: 100} */
    interval: AnyDuration;
    /** @default {seconds: 10} */
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

async function executeWaitUntil<const Assert extends AssertFunction<any>>(
    this: void,
    assert: AssertFunction<any>,
    rawArgs: unknown[],
    requireSynchronousResult: boolean,
) {
    const {callback, extraAssertionArgs, failureMessage, options} = parseWaitUntilArgs(rawArgs);

    const timeout = convertDuration(options.timeout, DurationUnit.Milliseconds).milliseconds;
    const interval = convertDuration(options.interval, DurationUnit.Milliseconds);

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

export type WaitUntilOverridesBase = Readonly<Record<string, AnyFunction>>;

export type WaitUntilFunctionParameters<Assert extends AssertFunction<any>, Input> = [
    ...RemoveFirstTupleEntry<RemoveLastTupleEntry<Parameters<Assert>>>,
    () => MaybePromise<Input>,
];

export type WaitUntilFunction<Assert extends AssertFunction<any>> =
    Assert extends AssertFunction<infer Guard>
        ? <Input extends Parameters<Assert>[0]>(
              ...params: [
                  ...WaitUntilFunctionParameters<Assert, Input>,
                  options?: WaitUntilOptions | undefined,
                  failureMessage?: string | undefined,
              ]
          ) => Promise<NarrowToExpected<Input, Guard>>
        : never;

type WaitUntilGroup<
    Asserts extends Readonly<Record<string, AssertFunction<any>>>,
    WaitUntilOverrides extends WaitUntilOverridesBase,
> = Omit<
    Overwrite<
        {
            [Name in keyof Asserts as Asserts[Name] extends AssertFunction<any>
                ? Name
                : never]: WaitUntilFunction<Asserts[Name]>;
        },
        WaitUntilOverrides
    >,
    ExtractKeysWithMatchingValues<WaitUntilOverrides, undefined>
>;

export function createWaitUntilGroup<
    const Asserts extends Readonly<Record<string, AssertFunction<any>>>,
    const WaitUntilOverrides extends WaitUntilOverridesBase,
>(asserts: Asserts, waitUntilOverrides: WaitUntilOverrides) {
    const waitUntilGroup = Object.entries(asserts).reduce(
        (
            accum,
            [
                name,
                assert,
            ],
        ) => {
            accum[name] = pickOverride(waitUntilOverrides, name, () =>
                createWaitUntil(assert),
            ) as any;
            return accum;
        },
        {} as Record<string, WaitUntilFunction<any>>,
    );

    return waitUntilGroup as WaitUntilGroup<Asserts, WaitUntilOverrides>;
}

export function createWaitUntil<const Assert extends AssertFunction<any>>(
    assert: Assert,
    requireSynchronousResult = false,
) {
    return ((...rawArgs: unknown[]) => {
        return executeWaitUntil(assert, rawArgs, requireSynchronousResult);
    }) as AnyFunction as WaitUntilFunction<Assert>;
}

function parseWaitUntilArgs(rawArgs: unknown[]) {
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
        options: {
            interval: args.options?.interval || defaultWaitUntilOptions.interval,
            timeout: args.options?.timeout || defaultWaitUntilOptions.timeout,
        } satisfies RequiredAndNotNull<WaitUntilOptions>,
        extraAssertionArgs: args.extraAssertionArgs.toReversed(),
        failureMessage: args.failureMessage,
    };
}
