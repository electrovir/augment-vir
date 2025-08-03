import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {randomString} from '../random/random-string.js';
import {
    filterObject,
    removeUndefinedValues,
    replaceNullValuesWithUndefined,
    replaceUndefinedValuesWithNull,
} from './object-filter.js';

describe(filterObject.name, () => {
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

        assert.deepEquals(testObject, originalObject);
        assert.deepEquals(Object.keys(testObject), originalKeys);
        assert.strictEquals(referenceCopy, testObject);
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

describe(removeUndefinedValues.name, () => {
    it('has proper types', () => {
        const output = removeUndefinedValues({
            a: 1 as undefined | number,
            b: 'value',
            c: null,
            d: undefined,
        });

        assert.tsType(output).slowEquals<{
            a?: number;
            b: string;
            c: null;
            d?: never;
        }>();
        assert.deepEquals(output, {a: 1, b: 'value', c: null});
    });
    itCases(removeUndefinedValues, [
        {
            it: 'removes undefined',
            input: {
                a: undefined,
                b: 'value',
                c: null,
            },
            expect: {
                b: 'value',
                c: null,
            },
        },
    ]);
});

describe(replaceUndefinedValuesWithNull.name, () => {
    it('has proper types', () => {
        const output = replaceUndefinedValuesWithNull({
            a: 1 as undefined | number,
            b: 'value',
            c: null,
            d: undefined,
        });

        assert.tsType(output).slowEquals<{
            a: number | null;
            b: string;
            c: null;
            d: null;
        }>();
        assert.deepEquals(output, {a: 1, b: 'value', c: null, d: null});

        const output2 = replaceUndefinedValuesWithNull({
            a: 1,
            b: 'value',
            c: null,
            d: undefined,
        } as {a?: number | undefined; b?: string; c: null; d: undefined});

        assert.tsType(output2).slowEquals<{
            a?: number | null;
            b?: string;
            c: null;
            d: null;
        }>();
    });
    itCases(replaceUndefinedValuesWithNull, [
        {
            it: 'removes undefined',
            input: {
                a: undefined,
                b: 'value',
                c: null,
            },
            expect: {
                a: null,
                b: 'value',
                c: null,
            },
        },
    ]);
});

describe(replaceNullValuesWithUndefined.name, () => {
    it('has proper types', () => {
        const output = replaceNullValuesWithUndefined({
            a: 1 as null | number,
            b: 'value',
            c: null,
            d: undefined,
        });

        assert.tsType(output).slowEquals<{
            a: number | undefined;
            b: string;
            c: undefined;
            d: undefined;
        }>();
        assert.deepEquals(output, {a: 1, b: 'value', c: undefined, d: undefined});

        const output2 = replaceNullValuesWithUndefined({
            a: 1,
            b: 'value',
            c: null,
            d: undefined,
        } as {a?: number | undefined; b?: string; c: null; d: undefined});

        assert.tsType(output2).slowEquals<{
            a?: number | undefined;
            b?: string;
            c: undefined;
            d: undefined;
        }>();
    });
    itCases(replaceNullValuesWithUndefined, [
        {
            it: 'removes null',
            input: {
                a: undefined,
                b: 'value',
                c: null,
            },
            expect: {
                a: undefined,
                b: 'value',
                c: undefined,
            },
        },
    ]);
});
