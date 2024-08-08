import {MaybePromise} from '../promise/maybe-promise.js';

/**
 * Call a function asynchronously without interrupting current synchronous execution, even if the
 * function was originally synchronous.
 */
export async function callAsynchronously<T>(callback: () => MaybePromise<T>) {
    return await Promise.resolve().then(() => callback());
}
