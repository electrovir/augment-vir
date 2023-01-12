import {itCases} from '@augment-vir/chai';
import {randomString} from '@augment-vir/node-js';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {
    areJsonEqual,
    copyThroughJson,
    filterObject,
    isObject,
    ObjectValueType,
} from '../../../../common/src';

describe(isObject.name, () => {
    it('should pass on empty object', () => {
        expect(isObject({})).to.equal(true);
    });

    it('should pass on filled in object', () => {
        expect(isObject({a: '4', b: '5'})).to.equal(true);
    });

    it('should fail on null', () => {
        expect(isObject(null)).to.equal(false);
    });

    it('should fail on function', () => {
        expect(isObject(() => {})).to.equal(false);
    });

    it('should fail on other non-objects', () => {
        const testingItems = [
            5,
            '5',
        ];

        expect(testingItems.some(isObject)).to.equal(false);
    });
});

describe(areJsonEqual.name, () => {
    it('should pass for different object references', () => {
        const objectA: Record<string, number> = {
            a: 1,
            c: 3,
        };
        const objectB: Record<string, number> = {
            a: 1,
            b: 2,
            c: 3,
        };

        objectA.b = 2;

        expect(areJsonEqual(objectA, objectB)).to.equal(true);
    });

    it('should pass for same object references', () => {
        const objectA: Record<string, number> = {
            a: 1,
            c: 3,
        };

        expect(areJsonEqual(objectA, objectA)).to.equal(true);
    });

    it('should not pass if objects are different', () => {
        const objectA: Record<string, number> = {
            a: 1,
            b: 2.1,
            c: 3,
        };
        const objectB: Record<string, number> = {
            a: 1,
            b: 2,
            c: 3,
        };

        expect(areJsonEqual(objectA, objectB)).to.equal(false);
        expect(areJsonEqual({...objectA, b: 2}, objectB)).to.equal(true);
    });
});

describe(copyThroughJson.name, () => {
    it('should create an identical copy', () => {
        const testObjectA = {a: 5, b: 'five', c: {d: 5}, e: [6]};

        expect(copyThroughJson(testObjectA)).to.deep.equal(testObjectA);
    });
});

describe('ObjectValueType', () => {
    it('should pass type checking', () => {
        type TestType = {a: number; b: string};

        const testObjectA: TestType = {a: 5, b: 'five'};
        const testValueC = testObjectA.a;
        let testAssign: ObjectValueType<TestType> = testObjectA.a;
        testAssign = testObjectA.b;
        // @ts-expect-error
        testAssign = [5];
        testAssign = testValueC;

        expect(testAssign).to.deep.equal(testObjectA.a);
    });
});

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
