import {wrapInTry} from '@augment-vir/common';
import {type AnyFunction, ensureError, extractErrorMessage} from '@augment-vir/core';
import {type FunctionTestCase} from './it-cases.js';
import {it} from './universal-it.js';
import {assertSnapshot} from './universal-snapshot.js';

/**
 * Similar to `itCases` but instead of defining expectation in each test case, each test case is a
 * snapshot test.
 *
 * In order to generate or update the snapshot files, run tests in update mode.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @example
 *
 * ```ts
 * import {snapshotCases, describe} from '@augment-vir/test';
 *
 * function myFunctionToTest(a: number, b: number) {
 *     return a + b;
 * }
 *
 * describe(myFunctionToTest.name, () => {
 *     snapshotCases(myFunctionToTest, [
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
export function snapshotCases<const FunctionToTest extends AnyFunction>(
    this: void,
    functionToTest: FunctionToTest,
    testCases: ReadonlyArray<Omit<FunctionTestCase<NoInfer<FunctionToTest>>, 'expect' | 'throws'>>,
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
                    return await functionToTest(...functionInputs);
                },
                {
                    handleError(caught) {
                        const error = ensureError(caught);

                        const errorClassName = error.constructor.name;

                        return {
                            [errorClassName]: extractErrorMessage(error),
                        };
                    },
                },
            );

            await assertSnapshot(testContext, snapshotData);
        });
    });
}
