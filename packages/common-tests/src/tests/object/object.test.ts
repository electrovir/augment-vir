import {
    ExcludeKeysWithMatchingValues,
    ExtractKeysWithMatchingValues,
    PropertyValueType,
    copyThroughJson,
    isObject,
} from '@augment-vir/common';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {assertTypeOf} from 'run-time-assertions';

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

const exampleObject = {
    a: 5,
    b: 'five',
    c: /five/,
    d: undefined,
    e: [],
} as const;

describe('ExtractKeysWithMatchingValues', () => {
    it('extracts keys', () => {
        assertTypeOf<
            ExtractKeysWithMatchingValues<typeof exampleObject, number>
        >().toEqualTypeOf<'a'>();
        assertTypeOf<
            ExtractKeysWithMatchingValues<typeof exampleObject, number | string>
        >().toEqualTypeOf<'a' | 'b'>();
    });
});

describe('ExcludeKeysWithMatchingValues', () => {
    it('extracts keys', () => {
        assertTypeOf<ExcludeKeysWithMatchingValues<typeof exampleObject, number>>().toEqualTypeOf<
            'b' | 'c' | 'd' | 'e'
        >();
        assertTypeOf<
            ExcludeKeysWithMatchingValues<typeof exampleObject, number | string>
        >().toEqualTypeOf<'c' | 'd' | 'e'>();
    });
});
