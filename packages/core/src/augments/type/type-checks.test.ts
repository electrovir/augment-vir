import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type IsAny, type IsEqual, type IsNever} from './type-checks.js';

describe('IsEqual', () => {
    it('compares literal and primitive types', () => {
        assert.tsType<IsEqual<number, string>>().equals<false>();
        assert.tsType<IsEqual<1, 1>>().equals<true>();
        assert.tsType<IsEqual<'A', 'B'>>().equals<false>();
        assert.tsType<IsEqual<'foo', 'foo'>>().equals<true>();
        assert.tsType<IsEqual<true, false>>().equals<false>();
        assert.tsType<IsEqual<false, false>>().equals<true>();
        assert.tsType<IsEqual<boolean, true>>().equals<false>();
    });

    it('distinguishes any, never, and unknown', () => {
        assert.tsType<IsEqual<any, number>>().equals<false>();
        assert.tsType<IsEqual<'', never>>().equals<false>();
        assert.tsType<IsEqual<any, any>>().equals<true>();
        assert.tsType<IsEqual<never, never>>().equals<true>();
        assert.tsType<IsEqual<any, never>>().equals<false>();
        assert.tsType<IsEqual<never, any>>().equals<false>();
        assert.tsType<IsEqual<any, unknown>>().equals<false>();
        assert.tsType<IsEqual<never, unknown>>().equals<false>();
        assert.tsType<IsEqual<unknown, never>>().equals<false>();
        assert.tsType<IsEqual<[never], [unknown]>>().equals<false>();
        assert.tsType<IsEqual<[unknown], [never]>>().equals<false>();
        assert.tsType<IsEqual<[any], [never]>>().equals<false>();
        assert.tsType<IsEqual<[any], [any]>>().equals<true>();
        assert.tsType<IsEqual<[never], [never]>>().equals<true>();
    });

    it('compares unions', () => {
        assert.tsType<IsEqual<1 | 2, 1>>().equals<false>();
        assert.tsType<IsEqual<1 | 2, 2 | 3>>().equals<false>();
        assert.tsType<IsEqual<1 | 2, 2 | 1>>().equals<true>();
    });

    it('detects optional and readonly modifiers', () => {
        assert.tsType<IsEqual<{a: 1}, {a: 1}>>().equals<true>();
        assert.tsType<IsEqual<{a: 1}, {a?: 1}>>().equals<false>();
        assert.tsType<IsEqual<{a: 1}, {readonly a: 1}>>().equals<false>();
    });

    it('compares arrays and tuples', () => {
        assert.tsType<IsEqual<[], []>>().equals<true>();
        assert.tsType<IsEqual<readonly [], readonly []>>().equals<true>();
        assert.tsType<IsEqual<readonly [], []>>().equals<false>();
        assert.tsType<IsEqual<number[], number[]>>().equals<true>();
        assert.tsType<IsEqual<readonly number[], readonly number[]>>().equals<true>();
        assert.tsType<IsEqual<readonly number[], number[]>>().equals<false>();
        assert.tsType<IsEqual<[string], [string]>>().equals<true>();
        assert
            .tsType<
                IsEqual<
                    [string],
                    [
                        string,
                        number,
                    ]
                >
            >()
            .equals<false>();
        assert
            .tsType<
                IsEqual<
                    | [
                          0,
                          1,
                      ]
                    | [
                          0,
                          2,
                      ],
                    [
                        0,
                        2,
                    ]
                >
            >()
            .equals<false>();
    });
});

describe('IsNever', () => {
    it('is true only for never', () => {
        assert.tsType<IsNever<never>>().equals<true>();
    });

    it('is false for non-never types', () => {
        assert.tsType<IsNever<string>>().equals<false>();
        assert.tsType<IsNever<any>>().equals<false>();
        assert.tsType<IsNever<unknown>>().equals<false>();
        assert.tsType<IsNever<undefined>>().equals<false>();
        assert.tsType<IsNever<null>>().equals<false>();
        assert.tsType<IsNever<0>>().equals<false>();
        assert.tsType<IsNever<''>>().equals<false>();
    });
});

describe('IsAny', () => {
    it('is true only for any', () => {
        assert.tsType<IsAny<any>>().equals<true>();
    });

    it('is false for non-any types', () => {
        assert.tsType<IsAny<string>>().equals<false>();
        assert.tsType<IsAny<'something'>>().equals<false>();
        assert.tsType<IsAny<never>>().equals<false>();
        assert.tsType<IsAny<unknown>>().equals<false>();
        assert.tsType<IsAny<null>>().equals<false>();
        assert.tsType<IsAny<undefined>>().equals<false>();
        assert.tsType<IsAny<void>>().equals<false>();
    });
});
