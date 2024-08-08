import {ensureError} from '../error/ensure-error.js';

export class DeferredPromise<T = void> {
    public promise: Promise<T>;
    public resolve!: (value: T | PromiseLike<T>) => void;
    public reject!: (reason?: any) => void;
    public isSettled = false;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = (value: any) => {
                this.isSettled = true;
                return resolve(value);
            };
            this.reject = (reason) => {
                this.isSettled = true;
                reject(ensureError(reason));
            };
        });
    }
}
