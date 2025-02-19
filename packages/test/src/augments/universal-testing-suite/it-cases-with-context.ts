import {assert, check, type CustomOutputAsserter} from '@augment-vir/assert';
import {
    ensureErrorAndPrependMessage,
    type AnyFunction,
    type MaybePromise,
    type RemoveFirstTupleEntry,
    type TypedFunction,
} from '@augment-vir/core';
import {type BaseTestCase} from './it-cases.js';
import {it} from './universal-it.js';
import {type UniversalTestContext} from './universal-test-context.js';

/**
 * Base function under test type for all test cases that pass in the test context.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type BaseFunctionWithContext = (testContext: UniversalTestContext, ...args: any[]) => any;

/**
 * Input for a test function with context that only has a single input.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type FunctionWithContextTestCaseSingleInput<FunctionToTest extends BaseFunctionWithContext> =
    {
        input: Parameters<FunctionToTest>[1];
    } & BaseTestCase<Awaited<ReturnType<FunctionToTest>>>;

/**
 * Input for a function test that has multiple inputs.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type FunctionWithContextTestCaseMultipleInputs<
    FunctionToTest extends BaseFunctionWithContext,
> = {
    inputs: Parameters<FunctionToTest>['length'] extends never
        ? FunctionToTest extends TypedFunction<[UniversalTestContext, ...infer ArgumentsType], any>
            ? // readonly rest params case
              ArgumentsType[]
            : // leftover case, haven't figured out how to trigger this yet
              never
        : // all other cases
          RemoveFirstTupleEntry<Parameters<FunctionToTest>>;
} & BaseTestCase<Awaited<ReturnType<FunctionToTest>>>;

/**
 * A function test case used for {@link itCasesWithContext}.
 *
 * @category Test : Util
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export type FunctionWithContextTestCase<FunctionToTest extends BaseFunctionWithContext> =
    2 extends Parameters<FunctionToTest>['length']
        ? Parameters<FunctionToTest>['length'] extends 1 | 2
            ? // only one param case
              FunctionWithContextTestCaseSingleInput<FunctionToTest>
            : // multiple params with a rest param
              FunctionWithContextTestCaseMultipleInputs<FunctionToTest>
        : 1 extends Parameters<FunctionToTest>['length']
          ? // no param case
            BaseTestCase<Awaited<ReturnType<FunctionToTest>>>
          : // multiple param case
            FunctionWithContextTestCaseMultipleInputs<FunctionToTest>;

const unsetError = Symbol('unset-error');

/**
 * Succinctly run many input / output tests for a pure function without repeating `it` boilerplate.
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @example
 *
 * ```ts
 * import {itCases, describe} from '@augment-vir/test';
 *
 * function myFunctionToTest(a: number, b: number) {
 *     return a + b;
 * }
 *
 * describe(myFunctionToTest.name, () => {
 *     itCases(myFunctionToTest, [
 *         {
 *             it: 'handles negative numbers',
 *             inputs: [
 *                 -1,
 *                 -2,
 *             ],
 *             expect: -3,
 *         },
 *         {
 *             it: 'handles 0',
 *             inputs: [
 *                 0,
 *                 0,
 *             ],
 *             expect: 0,
 *         },
 *         {
 *             it: 'adds',
 *             inputs: [
 *                 3,
 *                 5,
 *             ],
 *             expect: 8,
 *         },
 *     ]);
 * });
 * ```
 *
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function itCasesWithContext<const FunctionToTest extends BaseFunctionWithContext>(
    this: void,
    functionToTest: FunctionToTest,
    customAsserter: CustomOutputAsserter<NoInfer<FunctionToTest>>,
    testCases: ReadonlyArray<FunctionWithContextTestCase<NoInfer<FunctionToTest>>>,
): unknown[];
/**
 * Succinctly run many input / output tests for a pure function without repeating `it` boilerplate.
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @example
 *
 * ```ts
 * import {itCases, describe} from '@augment-vir/test';
 *
 * function myFunctionToTest(a: number, b: number) {
 *     return a + b;
 * }
 *
 * describe(myFunctionToTest.name, () => {
 *     itCases(myFunctionToTest, [
 *         {
 *             it: 'handles negative numbers',
 *             inputs: [
 *                 -1,
 *                 -2,
 *             ],
 *             expect: -3,
 *         },
 *         {
 *             it: 'handles 0',
 *             inputs: [
 *                 0,
 *                 0,
 *             ],
 *             expect: 0,
 *         },
 *         {
 *             it: 'adds',
 *             inputs: [
 *                 3,
 *                 5,
 *             ],
 *             expect: 8,
 *         },
 *     ]);
 * });
 * ```
 *
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function itCasesWithContext<const FunctionToTest extends BaseFunctionWithContext>(
    this: void,
    functionToTest: FunctionToTest,
    testCases: ReadonlyArray<FunctionWithContextTestCase<NoInfer<FunctionToTest>>>,
): unknown[];
/**
 * Succinctly run many input / output tests for a pure function without repeating `it` boilerplate.
 * Compatible with both [Node.js's test runner](https://nodejs.org/api/test.html) and
 * [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) or other Mocha-style test
 * runners.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @example
 *
 * ```ts
 * import {itCases, describe} from '@augment-vir/test';
 *
 * function myFunctionToTest(a: number, b: number) {
 *     return a + b;
 * }
 *
 * describe(myFunctionToTest.name, () => {
 *     itCases(myFunctionToTest, [
 *         {
 *             it: 'handles negative numbers',
 *             inputs: [
 *                 -1,
 *                 -2,
 *             ],
 *             expect: -3,
 *         },
 *         {
 *             it: 'handles 0',
 *             inputs: [
 *                 0,
 *                 0,
 *             ],
 *             expect: 0,
 *         },
 *         {
 *             it: 'adds',
 *             inputs: [
 *                 3,
 *                 5,
 *             ],
 *             expect: 8,
 *         },
 *     ]);
 * });
 * ```
 *
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function itCasesWithContext(
    this: void,
    functionToTest: BaseFunctionWithContext,
    testCasesOrCustomAsserter:
        | CustomOutputAsserter<AnyFunction>
        | ReadonlyArray<FunctionWithContextTestCase<AnyFunction>>,
    maybeTestCases?: ReadonlyArray<FunctionWithContextTestCase<AnyFunction>> | undefined,
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
        return itFunction(testCase.it, async (testContext) => {
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
                    [
                        testContext,
                        ...functionInputs,
                    ],
                    testCase.expect,
                    testCase.it,
                ) as MaybePromise<any>);
            } else {
                let caughtError: unknown = unsetError;
                try {
                    await functionToTest(testContext, ...functionInputs);
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
