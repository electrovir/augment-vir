import {AnyFunction} from '@augment-vir/common';
import {assert as assertImport} from 'chai';
import {Constructor} from 'type-fest';
import {assertOutputWithDescription} from './assert-output';

type BaseTestCase<OutputGeneric> = {
    it: string;
    force?: boolean | undefined;
    exclude?: boolean | undefined;
} & (
    | {
          expect: OutputGeneric;
      }
    | {
          throws: RegExp | string | Constructor<Error> | Error | null | undefined;
      }
);

export type OutputTestCaseSingleInput<FunctionToTestGeneric extends AnyFunction> = {
    input: Parameters<FunctionToTestGeneric>[0];
} & BaseTestCase<Awaited<ReturnType<FunctionToTestGeneric>>>;

export type OutputTestCaseMultipleInputs<FunctionToTestGeneric extends AnyFunction> = {
    inputs: Parameters<FunctionToTestGeneric>;
} & BaseTestCase<Awaited<ReturnType<FunctionToTestGeneric>>>;

export type FunctionTestCase<FunctionToTestGeneric extends AnyFunction> =
    Parameters<FunctionToTestGeneric> extends []
        ? BaseTestCase<Awaited<ReturnType<FunctionToTestGeneric>>>
        : Parameters<FunctionToTestGeneric> extends [any?]
        ? OutputTestCaseSingleInput<FunctionToTestGeneric>
        : OutputTestCaseMultipleInputs<FunctionToTestGeneric>;

export const runItCases = itCases;

export function itCases<FunctionToTestGeneric extends AnyFunction>(
    options: {
        assert: typeof assertImport;
        it: any;
        forceIt: any;
        excludeIt: any;
    },
    functionToTest: FunctionToTestGeneric,
    testCases: ReadonlyArray<FunctionTestCase<typeof functionToTest>>,
) {
    return testCases.map((testCase) => {
        const itFunction = testCase.force
            ? options.forceIt
            : testCase.exclude
            ? options.excludeIt
            : options.it;
        return itFunction(testCase.it, async () => {
            const functionInputs: Parameters<typeof functionToTest> =
                'input' in testCase
                    ? ([testCase.input] as Parameters<typeof functionToTest>)
                    : 'inputs' in testCase
                    ? testCase.inputs
                    : // as cast here to cover the case where the input has NO inputs
                      ([] as unknown as Parameters<typeof functionToTest>);

            if ('expect' in testCase) {
                await assertOutputWithDescription(
                    options.assert,
                    functionToTest,
                    testCase.expect,
                    testCase.it ?? '',
                    ...functionInputs,
                );
            } else {
                let caughtError: unknown;
                try {
                    await functionToTest(...functionInputs);
                } catch (thrownError) {
                    caughtError = thrownError;
                }
                const errorThrower = () => {
                    if (caughtError) {
                        throw caughtError;
                    }
                };
                // give a better name if possible
                Object.defineProperty(errorThrower, 'name', {
                    value: functionToTest.name,
                });

                if (!testCase.throws) {
                    options.assert.doesNotThrow(errorThrower);
                } else if (
                    testCase.throws instanceof RegExp ||
                    typeof testCase.throws === 'string'
                ) {
                    options.assert.throws(
                        errorThrower,
                        undefined,
                        testCase.throws,
                        `Caught error did not match expectations`,
                    );
                } else {
                    options.assert.throws(
                        errorThrower,
                        testCase.throws,
                        undefined,
                        `Caught error did not match expectations`,
                    );
                }
            }
        });
    });
}
