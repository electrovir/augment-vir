import {AnyFunction, TypedFunction} from '@augment-vir/common';
import {assert as assertImport} from 'chai';
import {Constructor} from 'type-fest';
import {CustomAsserter, assertOutputWithCustomAssertion} from './assert-output';

export type BaseTestCase<OutputGeneric> = {
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

export function itCases<FunctionToTest extends AnyFunction>(
    options: {
        assert: typeof assertImport;
        it: any;
        forceIt: any;
        excludeIt: any;
    },
    functionToTest: FunctionToTest,
    customAsserter: CustomAsserter<FunctionToTest>,
    testCases: ReadonlyArray<FunctionTestCase<FunctionToTest>>,
): unknown[];
export function itCases<FunctionToTest extends AnyFunction>(
    options: {
        assert: typeof assertImport;
        it: any;
        forceIt: any;
        excludeIt: any;
    },
    functionToTest: FunctionToTest,
    testCases: ReadonlyArray<FunctionTestCase<FunctionToTest>>,
): unknown[];
export function itCases<FunctionToTest extends AnyFunction>(
    options: {
        assert: typeof assertImport;
        it: any;
        forceIt: any;
        excludeIt: any;
    },
    functionToTest: FunctionToTest,
    testCasesOrCustomAsserter:
        | CustomAsserter<FunctionToTest>
        | ReadonlyArray<FunctionTestCase<FunctionToTest>>,
    maybeTestCases?: ReadonlyArray<FunctionTestCase<FunctionToTest>> | undefined,
): unknown[];
export function itCases<FunctionToTest extends AnyFunction>(
    options: {
        assert: typeof assertImport;
        it: any;
        forceIt: any;
        excludeIt: any;
    },
    functionToTest: FunctionToTest,
    testCasesOrCustomAsserter:
        | CustomAsserter<FunctionToTest>
        | ReadonlyArray<FunctionTestCase<FunctionToTest>>,
    maybeTestCases?: ReadonlyArray<FunctionTestCase<FunctionToTest>> | undefined,
): unknown[] {
    const testCases = maybeTestCases || testCasesOrCustomAsserter;
    if (!Array.isArray(testCases)) {
        throw new Error('expected an array of test cases');
    }
    const asserter = maybeTestCases ? testCasesOrCustomAsserter : options.assert.deepStrictEqual;

    if (typeof asserter !== 'function') {
        throw new Error('expected a function for the custom asserter');
    }

    return testCases.map((testCase) => {
        const itFunction = testCase.force
            ? options.forceIt
            : testCase.exclude
              ? options.excludeIt
              : options.it;
        return itFunction(testCase.it, async () => {
            const functionInputs: Parameters<FunctionToTest> =
                'input' in testCase
                    ? ([testCase.input] as unknown[] as Parameters<FunctionToTest>)
                    : 'inputs' in testCase
                      ? (testCase.inputs as unknown[] as Parameters<FunctionToTest>)
                      : // as cast here to cover the case where the input has NO inputs
                        ([] as unknown[] as Parameters<FunctionToTest>);

            if ('expect' in testCase) {
                await assertOutputWithCustomAssertion(
                    asserter,
                    functionToTest,
                    testCase.expect,
                    testCase.it,
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
