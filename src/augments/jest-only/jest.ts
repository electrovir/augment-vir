import {isPromiseLike} from '../promise';
export function assertInstanceOf<T>(
    input: unknown,
    classConstructor: new (...args: any) => T,
): asserts input is T {
    expect(input).toBeInstanceOf(classConstructor);
}

export function assertNotNullish<T>(input: T): asserts input is NonNullable<T> {
    expect(input).not.toBeNull();
    expect(input).not.toBeUndefined();
}

export function expectDuration(
    callback: () => PromiseLike<void>,
): Promise<jest.JestMatchers<number>>;
export function expectDuration(callback: () => void): jest.JestMatchers<number>;
export function expectDuration(
    callback: (() => void) | (() => PromiseLike<void>),
): Promise<jest.JestMatchers<number>> | jest.JestMatchers<number> {
    const startTime = Date.now();
    const callbackResult = callback();
    if (isPromiseLike(callbackResult)) {
        return new Promise<jest.JestMatchers<number>>(async (resolve, reject) => {
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
