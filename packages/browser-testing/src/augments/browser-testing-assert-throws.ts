import {isPromiseLike, MaybePromise, PartialAndNullable} from '@augment-vir/common';
import {assert} from '@open-wc/testing';

export type ErrorMatchOptions = PartialAndNullable<{
    matchMessage: string;
    matchConstructor: ErrorConstructor | Error;
}>;

export function assertThrows(
    callback: () => Promise<void>,
    matching?: ErrorMatchOptions | undefined,
    message?: string,
): Promise<void>;

export function assertThrows(
    callback: () => void,
    matching?: ErrorMatchOptions | undefined,
    message?: string,
): void;

export function assertThrows(
    callback: () => MaybePromise<void>,
    matching?: ErrorMatchOptions | undefined,
    message?: string,
): MaybePromise<void>;
export function assertThrows(
    callback: () => MaybePromise<void>,
    matching?: ErrorMatchOptions | undefined,
    message?: string,
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
            message,
        );
    }

    try {
        const result = callback();

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
