import {assert} from '@augment-vir/assert';
import {waitValue} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {awaitAllPromisesInObject} from './promise-object.js';

describe(awaitAllPromisesInObject.name, () => {
    it('works', async () => {
        const promiseObject = {
            notPromise: 'hi',
            promise: Promise.resolve('hi 2'),
            waitedPromise: waitValue({milliseconds: 10}, 'hi 3'),
        };

        const result = awaitAllPromisesInObject(promiseObject);

        assert.instanceOf(result, Promise);
        assert.notInstanceOf(promiseObject.notPromise, Promise);
        assert.instanceOf(promiseObject.promise, Promise);
        assert.instanceOf(promiseObject.waitedPromise, Promise);

        assert.tsType(result).equals<
            Promise<{
                notPromise: string;
                promise: string;
                waitedPromise: string;
            }>
        >();
        assert.tsType(await result).equals<{
            notPromise: string;
            promise: string;
            waitedPromise: string;
        }>();
        assert.deepEquals(await result, {
            notPromise: 'hi',
            promise: 'hi 2',
            waitedPromise: 'hi 3',
        });
    });
});
