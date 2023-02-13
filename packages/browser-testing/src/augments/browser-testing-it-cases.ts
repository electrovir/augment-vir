import {AnyFunction} from '@augment-vir/common';
import {FunctionTestCase, itCases as generic_itCases} from '@augment-vir/testing';
import {assert} from '@open-wc/testing';
export type {
    FunctionTestCase,
    OutputTestCaseMultipleInputs,
    OutputTestCaseSingleInput,
} from '@augment-vir/testing';

export const runItCases = itCases;

export function itCases<FunctionToCallGeneric extends AnyFunction>(
    functionToCall: FunctionToCallGeneric,
    testCases: ReadonlyArray<FunctionTestCase<typeof functionToCall>>,
) {
    return generic_itCases(
        {
            assert,
            it,
            forceIt: it.only,
            excludeIt: it.skip,
        },
        functionToCall,
        testCases,
    );
}
