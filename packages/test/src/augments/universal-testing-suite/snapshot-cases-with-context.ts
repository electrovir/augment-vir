import {wrapInTry} from '@augment-vir/common';
import {ensureError, extractErrorMessage, type AnyFunction} from '@augment-vir/core';
import {
    type BaseFunctionWithContext,
    type FunctionWithContextTestCase,
} from './it-cases-with-context.js';
import {it} from './universal-it.js';
import {assertSnapshot} from './universal-snapshot.js';

/**
 * Test case for {@link snapshotCasesWithContext}.
 *
 * @category Test
 * @category Package : @augment-vir/test
 */
export type SnapshotTestCaseWithContext<FunctionToTest extends AnyFunction> = Omit<
    FunctionWithContextTestCase<NoInfer<FunctionToTest>>,
    'expect' | 'throws'
> & {
    /**
     * If true, allows errors to be thrown and snapshotted. Otherwise thrown errors will fail the
     * test.
     */
    fails?: boolean;
};

/**
 * Same as `snapshotCases` but passes the test context as the first parameter to the function under
 * test.
 *
 * In order to generate or update the snapshot files, run tests in update mode.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @example
 *
 * ```ts
 * import {
 *     snapshotCasesWithContext,
 *     RuntimeEnv,
 *     describe,
 *     UniversalTestContext,
 *     assertTestContext,
 * } from '@augment-vir/test';
 *
 * function myFunctionToTest(testContext: UniversalTestContext, a: number, b: number) {
 *     assertTestContext(testContext, RuntimeEnv.Node);
 *     return testContext.name;
 * }
 *
 * describe(myFunctionToTest.name, () => {
 *     snapshotCasesWithContext(myFunctionToTest, [
 *         {
 *             it: 'handles negative numbers',
 *             inputs: [
 *                 -1,
 *                 -2,
 *             ],
 *         },
 *         {
 *             it: 'handles 0',
 *             inputs: [
 *                 0,
 *                 0,
 *             ],
 *         },
 *         {
 *             it: 'adds',
 *             inputs: [
 *                 3,
 *                 5,
 *             ],
 *         },
 *     ]);
 * });
 * ```
 *
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export function snapshotCasesWithContext<const FunctionToTest extends BaseFunctionWithContext>(
    this: void,
    functionToTest: FunctionToTest,
    testCases: ReadonlyArray<SnapshotTestCaseWithContext<NoInfer<FunctionToTest>>>,
) {
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

            const snapshotData = await wrapInTry(
                async () => {
                    return await functionToTest(testContext, ...functionInputs);
                },
                {
                    handleError(caught) {
                        if (testCase.fails) {
                            const error = ensureError(caught);

                            const errorClassName = error.constructor.name;

                            return {
                                [errorClassName]: extractErrorMessage(error),
                            };
                        } else {
                            throw caught;
                        }
                    },
                },
            );

            await assertSnapshot(testContext, snapshotData);
        });
    });
}
