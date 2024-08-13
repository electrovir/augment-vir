import {assert} from '@augment-vir/assert';
import {AnyFunction, ensureError} from '@augment-vir/core';

export type CustomAsserter<FunctionToCall extends AnyFunction> = (
    actual: Awaited<ReturnType<FunctionToCall>>,
    expected: Awaited<ReturnType<FunctionToCall>>,
    failureMessage?: string | undefined,
) => void;

export function assertOutputWithDescription<FunctionToCall extends AnyFunction>(
    functionToCall: FunctionToCall,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    description: string,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    return assertOutputWithCustomAssertion(
        assert.deepEquals,
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
    const result: unknown = functionToCall(...inputs);

    const failureMessage =
        description ||
        `${functionToCall.name} output failed to match expectation with input: ${inputs
            .map((entry) => JSON.stringify(entry))
            .join(', ')}`;

    if (result instanceof Promise) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                assertion(await result, expectedOutput, failureMessage);
                resolve();
            } catch (error) {
                reject(ensureError(error));
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
    functionToCall: FunctionToCall,
    expectedOutput: Awaited<ReturnType<typeof functionToCall>>,
    ...inputs: Parameters<typeof functionToCall>
): ReturnType<typeof functionToCall> extends Promise<any> ? Promise<void> : void {
    return assertOutputWithDescription(functionToCall, expectedOutput, '', ...inputs);
}
