import type {Writable} from 'type-fest';
import {ensureError} from '../error/ensure-error.js';

/**
 * Creates a promise that can be resolved or rejected at any later time. It also includes indication
 * on whether its been settled yet or not.
 *
 * @category Promise
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {DeferredPromise} from '@augment-vir/common';
 *
 * function waitForInput() {
 *     const deferred = new DeferredPromise<string>();
 *
 *     window.addEventListener('keydown', (event) => {
 *         deferred.resolve(event.code);
 *     });
 *     return deferred.promise;
 * }
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export class DeferredPromise<T = void> {
    /** The deferred promise which can be awaited. */
    public promise: Promise<T>;
    /** Call this to resolve the deferred promise with the given value. */
    public resolve!: (value: T | PromiseLike<T>) => void;
    /** Call this to reject the deferred promise with the given reason. */
    public reject!: (reason?: any) => void;
    /** Indicates whether the promise has been settled (resolved or rejected) yet. */
    public readonly isSettled: boolean = false;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = (value: any) => {
                (this as Writable<typeof this>).isSettled = true;
                return resolve(value);
            };
            this.reject = (reason) => {
                (this as Writable<typeof this>).isSettled = true;
                reject(ensureError(reason));
            };
        });
    }
}
