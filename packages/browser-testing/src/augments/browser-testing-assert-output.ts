import {AnyFunction} from '@augment-vir/common';
import {
    assertOutput as generic_assertOutput,
    assertOutputWithDescription as generic_assertOutputWithDescription,
} from '@augment-vir/testing';
import {assert} from '@open-wc/testing';

export function assertOutputWithDescription<FunctionToCallGeneric extends AnyFunction>(
    functionToCall: FunctionToCallGeneric,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    description: string,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    return generic_assertOutputWithDescription(
        assert,
        functionToCall,
        expectedOutput,
        description,
        ...inputs,
    );
}

export function assertOutput<FunctionToCallGeneric extends AnyFunction>(
    functionToCall: FunctionToCallGeneric,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    return generic_assertOutput(assert, functionToCall, expectedOutput, ...inputs);
}
