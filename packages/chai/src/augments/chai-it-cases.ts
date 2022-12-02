import {AnyFunction} from '@augment-vir/common';
import {FunctionTestCase, itCases as generic_itCases} from '@augment-vir/testing';
import {assert} from 'chai';
export type {
    FunctionTestCase,
    OutputTestCaseMultipleInputs,
    OutputTestCaseSingleInput,
} from '@augment-vir/testing';

export function itCases<FunctionToCallGeneric extends AnyFunction>(
    functionToCall: FunctionToCallGeneric,
    testCases: ReadonlyArray<FunctionTestCase<typeof functionToCall>>,
) {
    return generic_itCases({assert, it, forceIt: it.only}, functionToCall, testCases);
}
