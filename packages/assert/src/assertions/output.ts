import {
    AnyFunction,
    combineErrorMessages,
    ensureError,
    ensureErrorAndPrependMessage,
    extractErrorMessage,
    MaybePromise,
    stringify,
    wait,
} from '@augment-vir/core';
import {convertDuration, DurationUnit} from '@date-vir/duration';
import type {IsAny} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {parseWaitUntilOptions, WaitUntilOptions} from '../guard-types/wait-until-function.js';
import {deepEquals} from './equality/simple-equality.js';

/**
 * A customer asserter for `.output` guards (`assert.output`, `check.output`, etc.). This is
 * typically not necessary, as the `.output` guards already perform deep equality checks by
 * default.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import {assert, AssertionError, CustomOutputAsserter} from '@augment-vir/assert';
 *
 * function myFunctionToTest(name: string) {
 *     return `Hello there ${name}`;
 * }
 *
 * const myCustomAsserter: CustomOutputAsserter<typeof myFunctionToTest> = (
 *     actual,
 *     expected,
 *     failureMessage,
 * ) => {
 *     // Write your assertion in an `if`.
 *     if (!actual.startsWith('hello there') || actual.endsWith(expected)) {
 *         // Throw an `AssertionError` if the `if` fails.
 *         throw new AssertionError('', failureMessage);
 *     }
 * };
 * // Use your custom asserter as the first input to any `.output` guard.
 * assert.output(myCustomAsserter, myFunctionToTest, ['John'], 'John', 'Name insertion failed');
 * ```
 *
 * @param FunctionToCall The function type that your custom asserter will be run on.
 * @package @augment-vir/assert
 */
export type CustomOutputAsserter<FunctionToCall extends AnyFunction> = (
    actual: Awaited<ReturnType<FunctionToCall>>,
    expected: Awaited<ReturnType<FunctionToCall>>,
    failureMessage?: string | undefined,
) => void;

type OutputReturn<FunctionToCall extends AnyFunction, Return> =
    Promise<any> extends ReturnType<NoInfer<FunctionToCall>>
        ? IsAny<ReturnType<FunctionToCall>> extends true
            ? Return
            : Promise<Return>
        : Return;

export type OutputAssertWithoutAsserter = <const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
) => OutputReturn<NoInfer<FunctionToCall>, void>;
export type OutputAssertWithAsserter = <const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
) => OutputReturn<NoInfer<FunctionToCall>, void>;

function assertOutput<const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
): OutputReturn<NoInfer<FunctionToCall>, void>;
function assertOutput<const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
): OutputReturn<NoInfer<FunctionToCall>, void>;
function assertOutput(
    functionToCallOrAsserter: CustomOutputAsserter<AnyFunction> | AnyFunction,
    inputsOrFunctionToCall: unknown[] | AnyFunction,
    expectedOutputOrInputs: unknown,
    failureMessageOrExpectedOutput?: unknown,
    emptyOrFailureMessage?: string | undefined,
): MaybePromise<void> {
    return innerAssertOutput(
        ...extractOutputArgs(
            functionToCallOrAsserter,
            inputsOrFunctionToCall,
            expectedOutputOrInputs,
            failureMessageOrExpectedOutput,
            emptyOrFailureMessage,
        ),
        false,
    );
}

function extractOutputArgs(
    functionToCallOrAsserter: CustomOutputAsserter<AnyFunction> | AnyFunction,
    inputsOrFunctionToCall: unknown[] | AnyFunction,
    expectedOutputOrInputs: unknown,
    failureMessageOrExpectedOutput?: unknown,
    emptyOrFailureMessage?: string | undefined,
) {
    const usingCustomAsserter = Array.isArray(expectedOutputOrInputs);

    const asserter: CustomOutputAsserter<AnyFunction> = usingCustomAsserter
        ? (functionToCallOrAsserter as CustomOutputAsserter<AnyFunction>)
        : deepEquals;
    const functionToCall: AnyFunction = usingCustomAsserter
        ? (inputsOrFunctionToCall as AnyFunction)
        : functionToCallOrAsserter;
    const inputs: unknown[] = usingCustomAsserter
        ? expectedOutputOrInputs
        : (inputsOrFunctionToCall as unknown[]);
    const expectedOutput: unknown = usingCustomAsserter
        ? failureMessageOrExpectedOutput
        : expectedOutputOrInputs;
    const failureMessage: string | undefined = usingCustomAsserter
        ? emptyOrFailureMessage
        : (failureMessageOrExpectedOutput as string | undefined);

    return [
        asserter,
        functionToCall,
        inputs,
        expectedOutput,
        failureMessage,
    ] as const;
}

function innerAssertOutput<const ShouldReturnResult extends boolean>(
    asserter: CustomOutputAsserter<AnyFunction>,
    functionToCall: AnyFunction,
    inputs: unknown[],
    expectedOutput: unknown,
    failureMessage: string | undefined,
    shouldReturnResult: ShouldReturnResult,
): ShouldReturnResult extends true ? MaybePromise<unknown> : MaybePromise<void> {
    const result: unknown = functionToCall(...inputs);

    if (result instanceof Promise) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const awaitedResult = await result;
                asserter(awaitedResult, expectedOutput);
                if (shouldReturnResult) {
                    resolve(awaitedResult);
                } else {
                    (resolve as () => void)();
                }
            } catch (error) {
                reject(
                    new AssertionError(
                        `Output from '${functionToCall.name}' did not produce expected output with input: ${stringify(inputs)}: ${extractErrorMessage(error)}`,
                        failureMessage,
                    ),
                );
            }
        });
    } else {
        try {
            asserter(result, expectedOutput);
            if (shouldReturnResult) {
                return result satisfies unknown as any;
            } else {
                return;
            }
        } catch (error) {
            throw new AssertionError(
                `Output from '${functionToCall.name}' did not produce expected output with input: ${stringify(inputs)}: ${extractErrorMessage(error)}`,
                failureMessage,
            );
        }
    }
}

export type OutputCheckWithoutAsserter = <const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
) => OutputReturn<NoInfer<FunctionToCall>, boolean>;
export type OutputCheckWithAsserter = <const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
) => OutputReturn<NoInfer<FunctionToCall>, boolean>;

function checkOutput<const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
): OutputReturn<FunctionToCall, boolean>;
function checkOutput<const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
): OutputReturn<FunctionToCall, boolean>;
function checkOutput(
    functionToCallOrAsserter: CustomOutputAsserter<AnyFunction> | AnyFunction,
    inputsOrFunctionToCall: unknown[] | AnyFunction,
    expectedOutputOrInputs: unknown,
    failureMessageOrExpectedOutput?: unknown,
    emptyOrFailureMessage?: string | undefined,
): MaybePromise<boolean> {
    try {
        const assertionResult = innerAssertOutput(
            ...extractOutputArgs(
                functionToCallOrAsserter,
                inputsOrFunctionToCall,
                expectedOutputOrInputs,
                failureMessageOrExpectedOutput,
                emptyOrFailureMessage,
            ),
            false,
        );
        if (assertionResult instanceof Promise) {
            return new Promise<boolean>(async (resolve) => {
                try {
                    await assertionResult;
                    resolve(true);
                } catch {
                    resolve(false);
                }
            });
        } else {
            return true;
        }
    } catch {
        return false;
    }
}

export type OutputAssertWrapWithoutAsserter = <const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
) => OutputReturn<NoInfer<FunctionToCall>, Awaited<ReturnType<NoInfer<FunctionToCall>>>>;
export type OutputAssertWrapWithAsserter = <const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
) => OutputReturn<NoInfer<FunctionToCall>, Awaited<ReturnType<NoInfer<FunctionToCall>>>>;

function assertWrapOutput<const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
): OutputReturn<FunctionToCall, Awaited<ReturnType<NoInfer<FunctionToCall>>>>;
function assertWrapOutput<const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
): OutputReturn<FunctionToCall, Awaited<ReturnType<NoInfer<FunctionToCall>>>>;
function assertWrapOutput(
    functionToCallOrAsserter: CustomOutputAsserter<AnyFunction> | AnyFunction,
    inputsOrFunctionToCall: unknown[] | AnyFunction,
    expectedOutputOrInputs: unknown,
    failureMessageOrExpectedOutput?: unknown,
    emptyOrFailureMessage?: string | undefined,
): MaybePromise<unknown> {
    return innerAssertOutput(
        ...extractOutputArgs(
            functionToCallOrAsserter,
            inputsOrFunctionToCall,
            expectedOutputOrInputs,
            failureMessageOrExpectedOutput,
            emptyOrFailureMessage,
        ),
        true,
    );
}

export type OutputCheckWrapWithoutAsserter = <const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
) => OutputReturn<
    NoInfer<FunctionToCall>,
    Awaited<ReturnType<NoInfer<FunctionToCall>>> | undefined
>;
export type OutputCheckWrapWithAsserter = <const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
) => OutputReturn<
    NoInfer<FunctionToCall>,
    Awaited<ReturnType<NoInfer<FunctionToCall>>> | undefined
>;

function checkWrapOutput<const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
): OutputReturn<FunctionToCall, Awaited<ReturnType<NoInfer<FunctionToCall>>> | undefined>;
function checkWrapOutput<const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    failureMessage?: string | undefined,
): OutputReturn<FunctionToCall, Awaited<ReturnType<NoInfer<FunctionToCall>>> | undefined>;
function checkWrapOutput(
    functionToCallOrAsserter: CustomOutputAsserter<AnyFunction> | AnyFunction,
    inputsOrFunctionToCall: unknown[] | AnyFunction,
    expectedOutputOrInputs: unknown,
    failureMessageOrExpectedOutput?: unknown,
    emptyOrFailureMessage?: string | undefined,
): MaybePromise<unknown> {
    try {
        const assertionResult = innerAssertOutput(
            ...extractOutputArgs(
                functionToCallOrAsserter,
                inputsOrFunctionToCall,
                expectedOutputOrInputs,
                failureMessageOrExpectedOutput,
                emptyOrFailureMessage,
            ),
            true,
        );
        if (assertionResult instanceof Promise) {
            return new Promise<unknown>(async (resolve) => {
                try {
                    resolve(await assertionResult);
                } catch {
                    resolve(undefined);
                }
            });
        } else {
            return assertionResult;
        }
    } catch {
        return undefined;
    }
}

export type OutputWaitUntilWithoutAsserter = <const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
) => Promise<Awaited<ReturnType<NoInfer<FunctionToCall>>>>;
export type OutputWaitUntilWithAsserter = <const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
) => Promise<Awaited<ReturnType<NoInfer<FunctionToCall>>>>;

const notSetSymbol = Symbol('not set');

export async function waitUntilOutput<const FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Awaited<ReturnType<NoInfer<FunctionToCall>>>>;
export async function waitUntilOutput<const FunctionToCall extends AnyFunction>(
    asserter: CustomOutputAsserter<NoInfer<FunctionToCall>>,
    functionToCall: FunctionToCall,
    inputs: Parameters<NoInfer<FunctionToCall>>,
    expectedOutput: Awaited<ReturnType<NoInfer<FunctionToCall>>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<Awaited<ReturnType<NoInfer<FunctionToCall>>>>;
export async function waitUntilOutput(
    functionToCallOrAsserter: CustomOutputAsserter<AnyFunction> | AnyFunction,
    inputsOrFunctionToCall: unknown[] | AnyFunction,
    expectedOutputOrInputs: unknown,
    optionsOrExpectedOutput?: unknown,
    emptyOrFailureMessageOrOptions?: WaitUntilOptions | undefined | string,
    emptyOrFailureMessage?: string | undefined,
): Promise<unknown> {
    const usingCustomAsserter = Array.isArray(expectedOutputOrInputs);

    const asserter: CustomOutputAsserter<AnyFunction> = usingCustomAsserter
        ? (functionToCallOrAsserter as CustomOutputAsserter<AnyFunction>)
        : deepEquals;
    const functionToCall: AnyFunction = usingCustomAsserter
        ? (inputsOrFunctionToCall as AnyFunction)
        : functionToCallOrAsserter;
    const inputs: unknown[] = usingCustomAsserter
        ? expectedOutputOrInputs
        : (inputsOrFunctionToCall as unknown[]);
    const expectedOutput: unknown = usingCustomAsserter
        ? optionsOrExpectedOutput
        : expectedOutputOrInputs;
    const options = parseWaitUntilOptions(
        (usingCustomAsserter ? emptyOrFailureMessageOrOptions : optionsOrExpectedOutput) as
            | WaitUntilOptions
            | undefined,
    );
    const failureMessage: string | undefined = usingCustomAsserter
        ? emptyOrFailureMessage
        : (emptyOrFailureMessageOrOptions as string | undefined);

    const timeout = convertDuration(options.timeout, DurationUnit.Milliseconds).milliseconds;
    const interval = convertDuration(options.interval, DurationUnit.Milliseconds);

    let lastCallbackOutput: unknown = notSetSymbol;
    let lastError: Error | undefined = undefined;
    async function checkCondition() {
        try {
            lastCallbackOutput = await innerAssertOutput(
                asserter,
                functionToCall,
                inputs,
                expectedOutput,
                undefined,
                true,
            );
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
            throw ensureErrorAndPrependMessage(
                lastError,
                combineErrorMessages(
                    failureMessage,
                    `Timeout of '${timeout}' milliseconds exceeded waiting for callback value to match expectations`,
                ),
            );
        }
    }

    return lastCallbackOutput as Promise<unknown>;
}

const assertions: {
    /**
     * Asserts that the output of the given function deeply equals expectations. A custom asserter
     * can optionally be provided as the first argument to change the expectation checking from
     * "deeply equals" to whatever you want.
     *
     * Performs no type guarding.
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.output((input: number) => String(input), [5], '5'); // passes
     * assert.output((input: number) => String(input), [10], '5'); // fails
     *
     * assert.output(assert.isLengthAtLeast, (input: number) => String(input), [5], 2); // fails
     * assert.output(assert.isLengthAtLeast, (input: number) => String(input), [10], 2); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     */
    output: typeof assertOutput;
} = {
    output: assertOutput,
};

export const outputGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that the output of the given function deeply equals expectations. A custom
         * asserter can optionally be provided as the first argument to change the expectation
         * checking from the default "deeply equals" to whatever you want.
         *
         * Performs no type guarding.
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.output((input: number) => String(input), [5], '5'); // returns `true`
         * check.output((input: number) => String(input), [10], '5'); // returns `false`
         *
         * check.output(assert.isLengthAtLeast, (input: number) => String(input), [5], 2); // returns `false`
         * check.output(assert.isLengthAtLeast, (input: number) => String(input), [10], 2); // returns `true`
         * ```
         */
        output: checkOutput,
    },
    assertWrap: {
        /**
         * Asserts that the output of the given function deeply equals expectations. A custom
         * asserter can optionally be provided as the first argument to change the expectation
         * checking from the default "deeply equals" to whatever you want. Returns the output if the
         * assertion passes.
         *
         * Performs no type guarding.
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.output((input: number) => String(input), [5], '5'); // returns `'5'`
         * assertWrap.output((input: number) => String(input), [10], '5'); // throws an error
         *
         * assertWrap.output(assert.isLengthAtLeast, (input: number) => String(input), [5], 2); // throws an error
         * assertWrap.output(assert.isLengthAtLeast, (input: number) => String(input), [10], 2); // returns `10`
         * ```
         *
         * @returns The output if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         */
        output: assertWrapOutput,
    },
    checkWrap: {
        /**
         * Asserts that the output of the given function deeply equals expectations. A custom
         * asserter can optionally be provided as the first argument to change the expectation
         * checking from the default "deeply equals" to whatever you want. Returns the output if the
         * check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.output((input: number) => String(input), [5], '5'); // returns `'5'`
         * checkWrap.output((input: number) => String(input), [10], '5'); // returns `undefined`
         *
         * checkWrap.output(assert.isLengthAtLeast, (input: number) => String(input), [5], 2); // returns `undefined`
         * checkWrap.output(assert.isLengthAtLeast, (input: number) => String(input), [10], 2); // returns `10`
         * ```
         *
         * @returns The output if the assertion passes, otherwise `undefined`.
         */
        output: checkWrapOutput,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output deeply equals expectations. A custom
         * asserter can optionally be provided as the first argument to change the expectation
         * checking from the default "deeply equals" to whatever you want.
         *
         * Performs no type guarding.
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.output((input: number) => String(input), [5], '5'); // returns `'5'`
         * await waitUntil.output((input: number) => String(input), [10], '5'); // throws an error
         *
         * await waitUntil.output(
         *     assert.isLengthAtLeast,
         *     (input: number) => String(input),
         *     [5],
         *     2,
         * ); // throws an error
         * await waitUntil.output(
         *     assert.isLengthAtLeast,
         *     (input: number) => String(input),
         *     [10],
         *     2,
         * ); // returns `10`
         * ```
         *
         * @throws {@link AssertionError} If the assertion fails.
         */
        output: waitUntilOutput,
    },
} satisfies GuardGroup<typeof assertions>;
