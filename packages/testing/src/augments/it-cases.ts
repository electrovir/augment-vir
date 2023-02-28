import {AnyFunction, TypedFunction} from '@augment-vir/common';
import {assert as assertImport} from 'chai';
import {Constructor} from 'type-fest';
import {assertOutputWithDescription} from './assert-output';

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

export type OutputTestCaseSingleInput<FunctionToTestGeneric extends AnyFunction> = {
    input: Parameters<FunctionToTestGeneric>[0];
} & BaseTestCase<Awaited<ReturnType<FunctionToTestGeneric>>>;

export type OutputTestCaseMultipleInputs<FunctionToTestGeneric extends AnyFunction> = {
    inputs: Parameters<FunctionToTestGeneric>['length'] extends never
        ? FunctionToTestGeneric extends TypedFunction<[infer ArgumentsType], any>
            ? // readonly rest params case
              ArgumentsType[]
            : // leftover case, haven't figured out how to trigger this yet
              never
        : // all other cases
          Parameters<FunctionToTestGeneric>;
} & BaseTestCase<Awaited<ReturnType<FunctionToTestGeneric>>>;

export type FunctionTestCase<FunctionToTestGeneric extends AnyFunction> =
    1 extends Parameters<FunctionToTestGeneric>['length']
        ? Parameters<FunctionToTestGeneric>['length'] extends 0 | 1
            ? // only one param case
              OutputTestCaseSingleInput<FunctionToTestGeneric>
            : // multiple params with a rest param
              OutputTestCaseMultipleInputs<FunctionToTestGeneric>
        : 0 extends Parameters<FunctionToTestGeneric>['length']
        ? // no param case
          BaseTestCase<Awaited<ReturnType<FunctionToTestGeneric>>>
        : // multiple param case
          OutputTestCaseMultipleInputs<FunctionToTestGeneric>;

export const runItCases = itCases;

export function itCases<FunctionToTestGeneric extends AnyFunction>(
    options: {
        assert: typeof assertImport;
        it: any;
        forceIt: any;
        excludeIt: any;
    },
    functionToTest: FunctionToTestGeneric,
    testCases: ReadonlyArray<FunctionTestCase<FunctionToTestGeneric>>,
) {
    return testCases.map((testCase) => {
        const itFunction = testCase.force
            ? options.forceIt
            : testCase.exclude
            ? options.excludeIt
            : options.it;
        return itFunction(testCase.it, async () => {
            const functionInputs: Parameters<FunctionToTestGeneric> =
                'input' in testCase
                    ? ([testCase.input] as unknown[] as Parameters<FunctionToTestGeneric>)
                    : 'inputs' in testCase
                    ? (testCase.inputs as unknown[] as Parameters<FunctionToTestGeneric>)
                    : // as cast here to cover the case where the input has NO inputs
                      ([] as unknown[] as Parameters<FunctionToTestGeneric>);

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
