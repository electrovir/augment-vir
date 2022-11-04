import {isPromiseLike} from 'augment-vir';
import {assert} from 'chai';
import {AtLeastTuple} from '../tuple';

function assertOutputWithDescription<
    FunctionToCallGeneric extends (...args: any[]) => any | Promise<any>,
>(
    functionToCall: FunctionToCallGeneric,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    description: string,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    const result = functionToCall(...inputs);

    const failureMessage =
        description ||
        `${functionToCall.name} output failed to match expectation with input: ${inputs
            .map((entry) => JSON.stringify(entry))
            .join(', ')}`;

    if (isPromiseLike(result)) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                assert.deepStrictEqual(await result, expectedOutput, failureMessage);
                resolve();
            } catch (error) {
                reject(error);
            }
        }) as ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void;
    } else {
        assert.deepStrictEqual(result, expectedOutput, failureMessage);
        return undefined as ReturnType<typeof functionToCall> extends Promise<any>
            ? Promise<void>
            : void;
    }
}

export function assertOutput<FunctionToCallGeneric extends (...args: any[]) => any | Promise<any>>(
    functionToCall: FunctionToCallGeneric,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    return assertOutputWithDescription(functionToCall, expectedOutput, '', ...inputs);
}

type BaseTestCase<OutputGeneric> = {
    it: string;
} & (
    | {
          expect: OutputGeneric;
      }
    | {
          throws: RegExp | string | ErrorConstructor | Error | null | undefined;
      }
);

export type OutputTestCaseSingleInput<InputGeneric, OutputGeneric> = {
    input: InputGeneric;
} & BaseTestCase<OutputGeneric>;

export type OutputTestCaseMultipleInputs<InputGeneric, OutputGeneric> = {
    inputs: InputGeneric;
} & BaseTestCase<OutputGeneric>;

export type FunctionTestCase<FunctionToCallGeneric extends (...args: any[]) => any | Promise<any>> =
    Parameters<FunctionToCallGeneric> extends AtLeastTuple<any, 2>
        ? OutputTestCaseMultipleInputs<
              Parameters<FunctionToCallGeneric>,
              Awaited<ReturnType<FunctionToCallGeneric>>
          >
        : OutputTestCaseSingleInput<
              Parameters<FunctionToCallGeneric>[0],
              Awaited<ReturnType<FunctionToCallGeneric>>
          >;

export function itCases<FunctionToCallGeneric extends (...args: any[]) => any | Promise<any>>(
    functionToCall: FunctionToCallGeneric,
    testCases: ReadonlyArray<FunctionTestCase<typeof functionToCall>>,
) {
    return testCases.map((testCase) => {
        return it(testCase.it, async () => {
            const functionInputs: Parameters<typeof functionToCall> =
                'input' in testCase
                    ? ([testCase.input] as Parameters<typeof functionToCall>)
                    : testCase.inputs;

            if ('expect' in testCase) {
                assertOutputWithDescription(
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
                if (testCase.throws) {
                    if (testCase.throws instanceof RegExp || typeof testCase.throws === 'string') {
                        assert.throws(
                            () => {
                                throw caughtError;
                            },
                            testCase.throws,
                            undefined,
                            testCase.it,
                        );
                    } else {
                        assert.throws(
                            () => {
                                throw caughtError;
                            },
                            undefined,
                            testCase.throws,
                            testCase.it,
                        );
                    }
                }
            }
        });
    });
}
