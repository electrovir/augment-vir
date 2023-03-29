import {areJsonEqual, copyThroughJson, isObject, PropertyValueType} from '@augment-vir/common';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';

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
        const objectB: Readonly<Record<string, number>> = {
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

    it('should pass for non object inputs', () => {
        expect(areJsonEqual('hello', 'hello')).to.equal(true);
        assert.isTrue(areJsonEqual(undefined, undefined));
        assert.isFalse(areJsonEqual(undefined, {}));
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

describe('PropertyValueType', () => {
    it('should pass type checking', () => {
        type TestType = {a: number; b: string};

        const testObjectA: TestType = {a: 5, b: 'five'};
        const testValueC = testObjectA.a;
        let testAssign: PropertyValueType<TestType> = testObjectA.a;
        testAssign = testObjectA.b;
        // @ts-expect-error
        testAssign = [5];
        testAssign = testValueC;

        expect(testAssign).to.deep.equal(testObjectA.a);
    });
});
