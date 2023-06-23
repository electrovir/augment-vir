import {isPromiseLike} from '@augment-vir/common';
import type {assert as assertImport} from 'chai';
import {Constructor} from 'type-fest';

export function typedAssertInstanceOf<T>(
    assert: typeof assertImport,
    input: unknown,
    classConstructor: Constructor<T>,
    message?: string | undefined,
): asserts input is T {
    assert.instanceOf(input, classConstructor, message);
}

export function typedAssertNotNullish<T>(
    assert: typeof assertImport,
    input: T,
    message?: string | undefined,
): asserts input is NonNullable<T> {
    assert.isNotNull(input, message);
    assert.isDefined(input, message);
}

export function expectDuration<ExpectGeneric extends (value: any) => any>(
    expect: ExpectGeneric,
    callback: () => PromiseLike<void>,
): Promise<Chai.Assertion>;
export function expectDuration<ExpectGeneric extends (value: any) => any>(
    expect: ExpectGeneric,
    callback: () => void,
): Chai.Assertion;
export function expectDuration<ExpectGeneric extends (value: any) => any>(
    expect: ExpectGeneric,
    callback: (() => void) | (() => PromiseLike<void>),
): Promise<ReturnType<ExpectGeneric>> | ReturnType<ExpectGeneric> {
    const startTime = Date.now();
    const callbackResult = callback();
    if (isPromiseLike(callbackResult)) {
        return new Promise<ReturnType<ExpectGeneric>>(async (resolve, reject) => {
            try {
                await callbackResult;
                const endTime = Date.now();
                const totalTime = endTime - startTime;
                resolve(expect(totalTime));
            } catch (error) {
                reject(error);
            }
        });
    } else {
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        return expect(totalTime);
    }
}
