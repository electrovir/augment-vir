import {isPromiseLike} from '@augment-vir/common';

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
