import {AnyFunction, isPromiseLike} from '@augment-vir/common';
import type {assert as assertImport} from 'chai';

export function assertOutputWithDescription<FunctionToCallGeneric extends AnyFunction>(
    assert: typeof assertImport,
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

export function assertOutput<FunctionToCallGeneric extends AnyFunction>(
    assert: typeof assertImport,
    functionToCall: FunctionToCallGeneric,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    return assertOutputWithDescription(assert, functionToCall, expectedOutput, '', ...inputs);
}
