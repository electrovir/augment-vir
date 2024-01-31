import {AnyFunction, isPromiseLike} from '@augment-vir/common';
import type {assert as assertImport} from 'chai';

export type CustomAsserter<FunctionToCall extends AnyFunction> = (
    actual: Awaited<ReturnType<FunctionToCall>>,
    expected: Awaited<ReturnType<FunctionToCall>>,
    failureMessage?: string | undefined,
) => void;

export function assertOutputWithDescription<FunctionToCall extends AnyFunction>(
    assert: typeof assertImport,
    functionToCall: FunctionToCall,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    description: string,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    return assertOutputWithCustomAssertion(
        assert.deepStrictEqual,
        functionToCall,
        expectedOutput,
        description,
        ...inputs,
    );
}

export function assertOutputWithCustomAssertion<FunctionToCall extends AnyFunction>(
    assertion: CustomAsserter<FunctionToCall>,
    functionToCall: FunctionToCall,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    description: string,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    const result: ReturnType<FunctionToCall> = functionToCall(...inputs);

    const failureMessage =
        description ||
        `${functionToCall.name} output failed to match expectation with input: ${inputs
            .map((entry) => JSON.stringify(entry))
            .join(', ')}`;

    if (isPromiseLike(result)) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                assertion(await result, expectedOutput, failureMessage);
                resolve();
            } catch (error) {
                reject(error);
            }
        }) as ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void;
    } else {
        assertion(result as Awaited<ReturnType<FunctionToCall>>, expectedOutput, failureMessage);
        // fake a void return
        return undefined as ReturnType<typeof functionToCall> extends Promise<any>
            ? Promise<void>
            : void;
    }
}

export function assertOutput<FunctionToCall extends AnyFunction>(
    assert: typeof assertImport,
    functionToCall: FunctionToCall,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    return assertOutputWithDescription(assert, functionToCall, expectedOutput, '', ...inputs);
}
