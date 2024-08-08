import {assert, describe} from '@augment-vir/test';
import {randomString} from '../random/random-string.js';
import {filterObject} from './object-filter.js';

describe(filterObject.name, ({it, itCases}) => {
    const symbolKey = Symbol('symbol-key');

    const testObject = {
        simple: randomString(),
        [symbolKey]: Math.random(),
        anotherKey: randomString(),
        5: randomString(),
        numeric: Math.random(),
    } as const;

    it('should not modify input object', () => {
        const referenceCopy = testObject;
        const originalObject = {...testObject};
        const originalKeys = Object.keys(testObject);
        filterObject(originalKeys, () => false);

        assert.deepStrictEqual(testObject, originalObject);
        assert.deepStrictEqual(Object.keys(testObject), originalKeys);
        assert.strictEqual(referenceCopy, testObject);
    });

    itCases(filterObject, [
        {
            it: 'should not remove keys when filter is always true',
            expect: {
                simple: testObject.simple,
                [symbolKey]: testObject[symbolKey],
                anotherKey: testObject.anotherKey,
                5: testObject[5],
                numeric: testObject.numeric,
            },
            inputs: [
                testObject,
                () => true,
            ],
        },
        {
            it: 'should be able to remove symbol keys',
            expect: {
                simple: testObject.simple,
                anotherKey: testObject.anotherKey,
                5: testObject[5],
                numeric: testObject.numeric,
            },
            inputs: [
                testObject,
                (key) => {
                    return typeof key !== 'symbol';
                },
            ],
        },
        {
            it: 'should be able to filter to ONLY symbol keys',
            expect: {
                [symbolKey]: testObject[symbolKey],
            },
            inputs: [
                testObject,
                (key) => {
                    return typeof key == 'symbol';
                },
            ],
        },
        {
            it: 'should be able to remove by value',
            expect: {
                simple: testObject.simple,
                anotherKey: testObject.anotherKey,
                5: testObject[5],
            },
            inputs: [
                testObject,
                (key, value) => {
                    return typeof value === 'string';
                },
            ],
        },
    ]);
});
