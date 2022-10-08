import {expect} from 'chai';
import {isPromiseLike} from '../promise';

export function assertInstanceOf<T>(
    input: unknown,
    classConstructor: new (...args: any) => T,
): asserts input is T {
    expect(input).to.be.instanceOf(classConstructor);
}

export function assertNotNullish<T>(input: T): asserts input is NonNullable<T> {
    expect(input).not.to.equal(null);
    expect(input).not.to.equal(undefined);
}

export function expectDuration(callback: () => PromiseLike<void>): Promise<Chai.Assertion>;
export function expectDuration(callback: () => void): Chai.Assertion;
export function expectDuration(
    callback: (() => void) | (() => PromiseLike<void>),
): Promise<Chai.Assertion> | Chai.Assertion {
    const startTime = Date.now();
    const callbackResult = callback();
    if (isPromiseLike(callbackResult)) {
        return new Promise<Chai.Assertion>(async (resolve, reject) => {
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
