import {assert} from '@augment-vir/assert';
import {wait, type AnyObject} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {randomString} from '../random/random-string.js';
import {getOrSet, getOrSetFromMap} from './get-or-set.js';

describe(getOrSet.name, () => {
    it('does not return "| undefined" for indexed keys', () => {
        const partialObject: Record<any, string> = {};
        const result = getOrSet(partialObject, 'hi', () => 'value');

        assert.tsType(result).equals<string>();
    });

    function testGetOrSet(
        originalObject: Record<PropertyKey, unknown>,
        key: PropertyKey,
        newValue: unknown,
    ) {
        const got = getOrSet(originalObject, key, () => newValue);

        return {
            got,
            object: originalObject,
        };
    }

    itCases(testGetOrSet, [
        {
            it: 'adds a missing value',
            inputs: [
                {},
                'hi',
                'new value',
            ],
            expect: {
                got: 'new value',
                object: {hi: 'new value'},
            },
        },
        {
            it: 'does not modify a value that already exists',
            inputs: [
                {myKey: 'hello'},
                'myKey',
                randomString(),
            ],
            expect: {
                got: 'hello',
                object: {myKey: 'hello'},
            },
        },
        {
            it: 'keeps undefined values',
            inputs: [
                {myKey: undefined},
                'myKey',
                randomString(),
            ],
            expect: {
                got: undefined,
                object: {myKey: undefined},
            },
        },
    ]);

    it('does not call the callback unless needed', () => {
        let callCount = 0;
        const originalObject: AnyObject = {};
        const key = 'myKey';
        const newValue = randomString();

        assert.strictEquals(
            getOrSet(originalObject, key, () => {
                callCount++;
                return newValue;
            }),
            newValue,
        );
        assert.strictEquals(callCount, 1);

        assert.strictEquals(
            getOrSet(originalObject, key, () => {
                callCount++;
                return newValue;
            }),
            newValue,
        );
        assert.strictEquals(callCount, 1);
    });
    it('handles an async callback', async () => {
        const newValue = randomString();
        const result = getOrSet({} as AnyObject, 'myKey', async () => {
            return await Promise.resolve(newValue);
        });

        assert.instanceOf(result, Promise);

        assert.strictEquals(await result, newValue);
    });
    it('requires proper types', () => {
        const myObject: {a: string; b?: number} = {a: 'hello'};
        assert.tsType(getOrSet(myObject, 'b', () => 5)).equals<number>();
        // @ts-expect-error the "a" key requires a string type
        getOrSet(myObject, 'a', () => 5);
        assert
            .tsType(getOrSet(myObject, 'b', async () => Promise.resolve(5)))
            .equals<Promise<number>>();
    });
    it('re-throws callback errors', async () => {
        await assert.throws(
            async () => {
                await getOrSet({} as AnyObject, 'myKey', async () => {
                    return Promise.reject(new Error('test error'));
                });
            },
            {matchMessage: 'test error'},
        );
    });
    it('works with an indexed key type', () => {
        const myObject: Record<string, number> = {a: 4};
        assert.tsType(getOrSet(myObject, 'a', () => 5)).equals<number>();
        assert.tsType(getOrSet(myObject, 'b', () => 2)).equals<number>();
        assert.deepEquals(myObject, {a: 4, b: 2});
    });
});

describe(getOrSetFromMap.name, () => {
    it('retrieves an existing item', () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new Map([
            [
                exampleKey,
                exampleValue,
            ],
        ]);

        assert.strictEquals(
            getOrSetFromMap(exampleMap, exampleKey, () => ''),
            exampleValue,
        );
    });

    it('sets a new item if it did not exist', () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new Map();

        assert.strictEquals(
            getOrSetFromMap(exampleMap, exampleKey, () => exampleValue),
            exampleValue,
        );
        assert.strictEquals(exampleMap.get(exampleKey), exampleValue);
    });

    it('handles a promise', async () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new Map();

        assert.strictEquals(
            await getOrSetFromMap(exampleMap, exampleKey, () => Promise.resolve(exampleValue)),
            exampleValue,
        );
        assert.strictEquals(exampleMap.get(exampleKey), exampleValue);
    });
    it('handles a promise rejects', async () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new Map<any, string>();

        const result = getOrSetFromMap(exampleMap, exampleKey, async () => {
            await wait({milliseconds: 0});
            const test = true as boolean;
            if (test) {
                throw new Error('fail');
            } else {
                return exampleValue;
            }
        });
        assert.tsType(result).equals<Promise<string>>();

        await assert.throws(result);
        assert.isUndefined(exampleMap.get(exampleKey));
    });

    it('works with WeakMap', () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new WeakMap();

        assert.strictEquals(
            getOrSetFromMap(exampleMap, exampleKey, () => exampleValue),
            exampleValue,
        );
        assert.strictEquals(exampleMap.get(exampleKey), exampleValue);
    });
});
