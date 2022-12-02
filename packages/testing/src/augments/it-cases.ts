import {assert as assertImport} from 'chai';
import {Constructor} from 'type-fest';
import {assertOutputWithDescription} from './assert-output';

type BaseTestCase<OutputGeneric> = {
    it: string;
} & (
    | {
          expect: OutputGeneric;
      }
    | {
          throws: RegExp | string | Constructor<Error> | Error | null | undefined;
      }
);

export type OutputTestCaseSingleInput<InputGeneric, OutputGeneric> = {
    input: InputGeneric;
} & BaseTestCase<OutputGeneric>;

export type OutputTestCaseMultipleInputs<InputGeneric, OutputGeneric> = {
    inputs: InputGeneric;
} & BaseTestCase<OutputGeneric>;

export type FunctionTestCase<FunctionToCallGeneric extends (...args: any[]) => any | Promise<any>> =
    Parameters<FunctionToCallGeneric> extends []
        ? BaseTestCase<Awaited<ReturnType<FunctionToCallGeneric>>>
        : Parameters<FunctionToCallGeneric> extends [any?]
        ? OutputTestCaseSingleInput<
              Parameters<FunctionToCallGeneric>[0],
              Awaited<ReturnType<FunctionToCallGeneric>>
          >
        : OutputTestCaseMultipleInputs<
              Parameters<FunctionToCallGeneric>,
              Awaited<ReturnType<FunctionToCallGeneric>>
          >;

export function itCases<FunctionToCallGeneric extends (...args: any[]) => any | Promise<any>>(
    assert: typeof assertImport,
    functionToCall: FunctionToCallGeneric,
    testCases: ReadonlyArray<FunctionTestCase<typeof functionToCall>>,
) {
    return testCases.map((testCase) => {
        return it(testCase.it, async () => {
            const functionInputs: Parameters<typeof functionToCall> =
                'input' in testCase
                    ? ([testCase.input] as Parameters<typeof functionToCall>)
                    : 'inputs' in testCase
                    ? testCase.inputs
                    : // as cast here to cover the case where the input has NO inputs
                      ([] as unknown as Parameters<typeof functionToCall>);

            if ('expect' in testCase) {
                await assertOutputWithDescription(
                    assert,
                    functionToCall,
                    testCase.expect,
                    testCase.it ?? '',
                    ...functionInputs,
                );
            } else {
                let caughtError: unknown;
                try {
                    await functionToCall(...functionInputs);
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
                    value: functionToCall.name,
                });

                if (!testCase.throws) {
                    assert.doesNotThrow(
                        errorThrower,
                        `${errorThrower.name} should not have thrown an error.`,
                    );
                } else if (
                    testCase.throws instanceof RegExp ||
                    typeof testCase.throws === 'string'
                ) {
                    assert.throws(
                        errorThrower,
                        undefined,
                        testCase.throws,
                        `Caught error did not match expectations`,
                    );
                } else {
                    assert.throws(
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
