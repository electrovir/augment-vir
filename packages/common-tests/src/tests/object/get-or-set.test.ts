import {itCases} from '@augment-vir/chai';
import {AnyObject, getOrSet, getOrSetFromMap, randomString} from '@augment-vir/common';
import {assert} from 'chai';
import {describe} from 'mocha';
import {assertInstanceOf, assertThrows, assertTypeOf} from 'run-time-assertions';

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

        assert.strictEqual(
            getOrSetFromMap(exampleMap, exampleKey, () => ''),
            exampleValue,
        );
    });

    it('sets a new item if it did not exist', () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new Map();

        assert.strictEqual(
            getOrSetFromMap(exampleMap, exampleKey, () => exampleValue),
            exampleValue,
        );
        assert.strictEqual(exampleMap.get(exampleKey), exampleValue);
    });

    it('works with WeakMap', () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new WeakMap();

        assert.strictEqual(
            getOrSetFromMap(exampleMap, exampleKey, () => exampleValue),
            exampleValue,
        );
        assert.strictEqual(exampleMap.get(exampleKey), exampleValue);
    });
});

describe(getOrSet.name, () => {
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

        assert.strictEqual(
            getOrSet(originalObject, key, () => {
                callCount++;
                return newValue;
            }),
            newValue,
        );
        assert.strictEqual(callCount, 1);

        assert.strictEqual(
            getOrSet(originalObject, key, () => {
                callCount++;
                return newValue;
            }),
            newValue,
        );
        assert.strictEqual(callCount, 1);
    });
    it('handles an async callback', async () => {
        const newValue = randomString();
        const result = getOrSet({} as AnyObject, 'myKey', async () => {
            return await Promise.resolve(newValue);
        });

        assertInstanceOf(result, Promise);

        assert.strictEqual(await result, newValue);
    });
    it('requires proper types', () => {
        const myObject: {a: string; b?: number} = {a: 'hello'};
        assertTypeOf(getOrSet(myObject, 'b', () => 5)).toEqualTypeOf<number>();
        // @ts-expect-error the "a" key requires a string type
        getOrSet(myObject, 'a', () => 5);
        assertTypeOf(getOrSet(myObject, 'b', async () => 5)).toEqualTypeOf<Promise<number>>();
    });
    it('re-throws callback errors', async () => {
        await assertThrows(
            async () => {
                await getOrSet({} as AnyObject, 'myKey', async () => {
                    throw new Error('test error');
                });
            },
            {matchMessage: 'test error'},
        );
    });
    it('works with an indexed key type', () => {
        const myObject: Record<string, number> = {a: 4};
        assertTypeOf(getOrSet(myObject, 'a', () => 5)).toEqualTypeOf<number>();
        assertTypeOf(getOrSet(myObject, 'b', () => 2)).toEqualTypeOf<number>();
        assert.deepStrictEqual(myObject, {a: 4, b: 2});
    });
});
