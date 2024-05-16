import {AnyFunction} from '@augment-vir/common';
import {CustomAsserter, FunctionTestCase, itCases as generic_itCases} from '@augment-vir/testing';
import {assert} from 'chai';
export type {
    FunctionTestCase,
    OutputTestCaseMultipleInputs,
    OutputTestCaseSingleInput,
} from '@augment-vir/testing';

export function itCases<FunctionToTest extends AnyFunction>(
    functionToTest: FunctionToTest,
    customAsserter: CustomAsserter<typeof functionToTest>,
    testCases: ReadonlyArray<FunctionTestCase<typeof functionToTest>>,
): unknown[];
export function itCases<FunctionToTest extends AnyFunction>(
    functionToTest: FunctionToTest,
    testCases: ReadonlyArray<FunctionTestCase<typeof functionToTest>>,
): unknown[];
export function itCases<FunctionToTest extends AnyFunction>(
    functionToTest: FunctionToTest,
    testCasesOrCustomAsserter:
        | CustomAsserter<typeof functionToTest>
        | ReadonlyArray<FunctionTestCase<typeof functionToTest>>,
    maybeTestCases?: ReadonlyArray<FunctionTestCase<typeof functionToTest>> | undefined,
): unknown[] {
    return generic_itCases(
        {assert, it, forceIt: it.only, excludeIt: it.skip},
        functionToTest,
        testCasesOrCustomAsserter,
        maybeTestCases,
    );
}
