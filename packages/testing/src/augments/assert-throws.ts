import {isPromiseLike, MaybePromise, PartialAndNullable} from '@augment-vir/common';
import type {assert as assertImport} from 'chai';

export type ErrorMatchOptions = PartialAndNullable<{
    matchMessage: string | RegExp;
    matchConstructor: ErrorConstructor | Error | {new (...args: any[]): Error};
}>;

export function assertThrows(
    assert: typeof assertImport,
    callback: Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): Promise<void>;
export function assertThrows(
    assert: typeof assertImport,
    callback: () => Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): Promise<void>;
export function assertThrows(
    assert: typeof assertImport,
    callback: () => any,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): void;
export function assertThrows(
    assert: typeof assertImport,
    callback: () => MaybePromise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void>;
export function assertThrows(
    assert: typeof assertImport,
    callbackOrPromise:
        | (() => MaybePromise<any>)
        | (() => Promise<any>)
        | (() => any)
        | Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void>;
export function assertThrows(
    assert: typeof assertImport,
    callbackOrPromise:
        | (() => MaybePromise<any>)
        | (() => Promise<any>)
        | (() => any)
        | Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void> {
    let caughtError: any = undefined;

    function runAssertion() {
        assert.throws(
            () => {
                if (caughtError != undefined) {
                    throw caughtError;
                }
            },
            matching?.matchConstructor
                ? (matching?.matchConstructor as any)
                : matching?.matchMessage,
            matching?.matchMessage,
            failureMessage,
        );
    }

    try {
        const result =
            callbackOrPromise instanceof Promise ? callbackOrPromise : callbackOrPromise();

        if (isPromiseLike(result)) {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    await result;
                } catch (error) {
                    caughtError = error;
                }

                try {
                    runAssertion();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        }
    } catch (error) {
        caughtError = error;
    }

    runAssertion();
}
