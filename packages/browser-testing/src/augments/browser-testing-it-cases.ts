import {AnyFunction} from '@augment-vir/common';
import {CustomAsserter, FunctionTestCase, itCases as generic_itCases} from '@augment-vir/testing';
import {assert} from '@open-wc/testing';
export type {OutputTestCaseMultipleInputs, OutputTestCaseSingleInput} from '@augment-vir/testing';

export function itCases<FunctionToTest extends AnyFunction>(
    functionToTest: FunctionToTest,
    customAsserter: CustomAsserter<FunctionToTest>,
    testCases: ReadonlyArray<FunctionTestCase<FunctionToTest>>,
): unknown[];
export function itCases<FunctionToTest extends AnyFunction>(
    functionToTest: FunctionToTest,
    testCases: ReadonlyArray<FunctionTestCase<FunctionToTest>>,
): unknown[];
export function itCases<FunctionToTest extends AnyFunction>(
    functionToTest: FunctionToTest,
    testCasesOrCustomAsserter:
        | CustomAsserter<FunctionToTest>
        | ReadonlyArray<FunctionTestCase<FunctionToTest>>,
    maybeTestCases?: ReadonlyArray<FunctionTestCase<FunctionToTest>> | undefined,
): unknown[] {
    return generic_itCases(
        {assert, it, forceIt: it.only, excludeIt: it.skip},
        functionToTest,
        testCasesOrCustomAsserter,
        maybeTestCases,
    );
}
