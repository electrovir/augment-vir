import {assert} from 'chai';
import {assertThrows, ErrorMatchOptions, isRunTimeType} from 'run-time-assertions';
import {ensureErrorAndPrependMessage} from '../error/ensure-error.js';
import {assertOutputWithCustomAssertion, CustomAsserter} from '../function/assert-output.js';
import {AnyFunction, TypedFunction} from '../function/generic-function-types.js';
import {NestedItError} from './nested-it.error.js';
import {UniversalIt} from './universal-it.js';

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

export type OutputTestCaseSingleInput<FunctionToTest extends AnyFunction> = {
    input: Parameters<FunctionToTest>[0];
} & BaseTestCase<Awaited<ReturnType<FunctionToTest>>>;

export type OutputTestCaseMultipleInputs<FunctionToTest extends AnyFunction> = {
    inputs: Parameters<FunctionToTest>['length'] extends never
        ? FunctionToTest extends TypedFunction<[infer ArgumentsType], any>
            ? // readonly rest params case
              ArgumentsType[]
            : // leftover case, haven't figured out how to trigger this yet
              never
        : // all other cases
          Parameters<FunctionToTest>;
} & BaseTestCase<Awaited<ReturnType<FunctionToTest>>>;

export type FunctionTestCase<FunctionToTest extends AnyFunction> =
    1 extends Parameters<FunctionToTest>['length']
        ? Parameters<FunctionToTest>['length'] extends 0 | 1
            ? // only one param case
              OutputTestCaseSingleInput<FunctionToTest>
            : // multiple params with a rest param
              OutputTestCaseMultipleInputs<FunctionToTest>
        : 0 extends Parameters<FunctionToTest>['length']
          ? // no param case
            BaseTestCase<Awaited<ReturnType<FunctionToTest>>>
          : // multiple param case
            OutputTestCaseMultipleInputs<FunctionToTest>;

const unsetError = Symbol('unset-error');

export function createItCases(it: UniversalIt) {
    return (
        functionToTest: AnyFunction,
        testCasesOrCustomAsserter:
            | CustomAsserter<typeof functionToTest>
            | ReadonlyArray<FunctionTestCase<typeof functionToTest>>,
        maybeTestCases?: ReadonlyArray<FunctionTestCase<typeof functionToTest>> | undefined,
    ): unknown[] => {
        const testCases: ReadonlyArray<BaseTestCase<unknown>> | undefined = (maybeTestCases ||
            testCasesOrCustomAsserter) as ReadonlyArray<BaseTestCase<unknown>> | undefined;
        if (!isRunTimeType(testCases, 'array')) {
            throw new TypeError('expected an array of test cases');
        }
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const asserter = maybeTestCases ? testCasesOrCustomAsserter : assert.deepStrictEqual;

        if (typeof asserter !== 'function') {
            throw new TypeError('expected a function for the custom asserter');
        }

        return testCases.map((testCase) => {
            const itFunction = testCase.only ? it.only : testCase.skip ? it.skip : it;
            try {
                return itFunction(testCase.it, async () => {
                    const functionInputs: unknown[] =
                        'input' in testCase
                            ? ([testCase.input] as unknown[])
                            : 'inputs' in testCase
                              ? (testCase.inputs as unknown[])
                              : // as cast here to cover the case where the input has NO inputs
                                ([] as unknown[]);

                    if ('expect' in testCase) {
                        await assertOutputWithCustomAssertion(
                            asserter,
                            functionToTest,
                            testCase.expect,
                            testCase.it,
                            ...functionInputs,
                        );
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
                            assertThrows(
                                errorThrower,
                                testCase.throws,
                                'Caught error did not match expectations',
                            );
                        }
                    }
                });
            } catch (error) {
                if (error instanceof NestedItError) {
                    throw new NestedItError(
                        "Cannot call 'itCases' inside of another 'it' or 'itCases'.",
                    );
                } else {
                    throw error;
                }
            }
        });
    };
}
