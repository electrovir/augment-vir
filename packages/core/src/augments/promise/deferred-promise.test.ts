import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {DeferredPromise} from './deferred-promise.js';

// increase if tests are flaky in other environments, like GitHub Actions (which is typically slow)
const promiseDelayMs = 500;

describe(DeferredPromise.name, () => {
    it('should create a promise which can be resolved externally.', async () => {
        const resolveValue = Math.random();

        const deferredPromise = new DeferredPromise<number>();
        setTimeout(() => {
            deferredPromise.resolve(resolveValue);
        }, promiseDelayMs);

        assert.strictEquals(await deferredPromise.promise, resolveValue);
    });

    it('should create a promise that can be rejected externally.', async () => {
        const message = 'this was rejected internally';
        const deferredPromise = new DeferredPromise<number>();
        setTimeout(() => {
            deferredPromise.reject(message);
        }, promiseDelayMs);

        await assert.throws(() => deferredPromise.promise, {
            matchMessage: message,
        });
    });

    it('should settle after rejection', async () => {
        const examplePromise = new DeferredPromise<number>();

        assert.isFalse(examplePromise.isSettled);

        examplePromise.reject('no reason');

        assert.isTrue(examplePromise.isSettled);

        await assert.throws(() => examplePromise.promise);
    });

    it('should settle after resolution', async () => {
        const examplePromise = new DeferredPromise<number>();

        assert.isFalse(examplePromise.isSettled);

        examplePromise.resolve(Math.random());

        assert.isTrue(examplePromise.isSettled);

        assert.isNumber(await examplePromise.promise);
    });
});
