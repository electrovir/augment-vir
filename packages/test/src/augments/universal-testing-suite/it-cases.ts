import {assert, check, ErrorMatchOptions, type CustomOutputAsserter} from '@augment-vir/assert';
import {
    ensureErrorAndPrependMessage,
    type AnyFunction,
    type MaybePromise,
    type TypedFunction,
} from '@augment-vir/core';
import {it} from './universal-it.js';

/**
 * Base test case for {@link itCases}.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type BaseTestCase<OutputGeneric> = {
    it: string;
    only?: boolean | undefined;
    skip?: boolean | undefined;
} & (
    | {
          expect: OutputGeneric;
      }
    | {
          throws: ErrorMatchOptions | undefined;
      }
);

/**
 * Input for a function test that only has a single input.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type FunctionTestCaseSingleInput<FunctionToTest extends AnyFunction> = {
    input: Parameters<FunctionToTest>[0];
} & BaseTestCase<Awaited<ReturnType<FunctionToTest>>>;

/**
 * Input for a function test that has multiple inputs.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type FunctionTestCaseMultipleInputs<FunctionToTest extends AnyFunction> = {
    inputs: Parameters<FunctionToTest>['length'] extends never
        ? FunctionToTest extends TypedFunction<[infer ArgumentsType], any>
            ? // readonly rest params case
              ArgumentsType[]
            : // leftover case, haven't figured out how to trigger this yet
              never
        : // all other cases
          Parameters<FunctionToTest>;
} & BaseTestCase<Awaited<ReturnType<FunctionToTest>>>;

/**
 * A function test case used for {@link itCases}.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export type FunctionTestCase<FunctionToTest extends AnyFunction> =
    1 extends Parameters<FunctionToTest>['length']
        ? Parameters<FunctionToTest>['length'] extends 0 | 1
            ? // only one param case
              FunctionTestCaseSingleInput<FunctionToTest>
            : // multiple params with a rest param
              FunctionTestCaseMultipleInputs<FunctionToTest>
        : 0 extends Parameters<FunctionToTest>['length']
          ? // no param case
            BaseTestCase<Awaited<ReturnType<FunctionToTest>>>
          : // multiple param case
            FunctionTestCaseMultipleInputs<FunctionToTest>;

const unsetError = Symbol('unset-error');

export function itCases<const FunctionToTest extends AnyFunction>(
    functionToTest: FunctionToTest,
    customAsserter: CustomOutputAsserter<NoInfer<FunctionToTest>>,
    testCases: ReadonlyArray<FunctionTestCase<NoInfer<FunctionToTest>>>,
): unknown[];
export function itCases<const FunctionToTest extends AnyFunction>(
    functionToTest: FunctionToTest,
    testCases: ReadonlyArray<FunctionTestCase<NoInfer<FunctionToTest>>>,
): unknown[];
/**
 * Succinctly run many input / output tests for a pure function without repeating `it` boilerplate.
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @package @augment-vir/test
 */
export function itCases(
    functionToTest: AnyFunction,
    testCasesOrCustomAsserter:
        | CustomOutputAsserter<AnyFunction>
        | ReadonlyArray<FunctionTestCase<AnyFunction>>,
    maybeTestCases?: ReadonlyArray<FunctionTestCase<AnyFunction>> | undefined,
): unknown[] {
    const testCases: ReadonlyArray<BaseTestCase<unknown>> | undefined = (maybeTestCases ||
        testCasesOrCustomAsserter) as ReadonlyArray<BaseTestCase<unknown>> | undefined;
    if (!check.isArray(testCases)) {
        throw new TypeError('expected an array of test cases');
    }

    const asserter = maybeTestCases ? testCasesOrCustomAsserter : assert.deepEquals;

    if (typeof asserter !== 'function') {
        throw new TypeError('expected a function for the custom asserter');
    }

    return testCases.map((testCase) => {
        const itFunction = testCase.only ? it.only : testCase.skip ? it.skip : it;
        return itFunction(testCase.it, async () => {
            const functionInputs: unknown[] =
                'input' in testCase
                    ? ([testCase.input] as unknown[])
                    : 'inputs' in testCase
                      ? (testCase.inputs as unknown[])
                      : // as cast here to cover the case where the input has NO inputs
                        ([] as unknown[]);

            if ('expect' in testCase) {
                await (assert.output(
                    asserter,
                    functionToTest,
                    functionInputs,
                    testCase.expect,
                    testCase.it,
                ) as MaybePromise<any>);
            } else {
                let caughtError: unknown = unsetError;
                try {
                    await functionToTest(...functionInputs);
                } catch (thrownError) {
                    caughtError = thrownError;
                }
                const errorThrower = () => {
                    if (caughtError !== unsetError) {
                        throw caughtError;
                    }
                };
                // give a better name if possible
                Object.defineProperty(errorThrower, 'name', {
                    value: functionToTest.name,
                });

                const expectsAnError: boolean = !!(
                    testCase.throws?.matchConstructor || testCase.throws?.matchMessage
                );

                if (caughtError !== unsetError && !expectsAnError) {
                    throw ensureErrorAndPrependMessage(
                        caughtError,
                        `${functionToTest.name} threw an unexpected error`,
                    );
                } else if (expectsAnError) {
                    assert.throws(
                        errorThrower,
                        testCase.throws,
                        'Caught error did not match expectations',
                    );
                }
            }
        });
    });
}
