import {describe, it} from '@augment-vir/test/src/augments/universal-testing-suite/index';
import {assert} from './assert/assert.js';
import {falsyArray, truthyArray} from './boolean.mock.js';
import {ifTruthy, isTruthy, Truthy} from './truthy.js';

describe(isTruthy.name, () => {
    it('should return true for various truthy things', () => {
        assert.isTrue(truthyArray.every(isTruthy));
    });

    it('should filter out null types', () => {
        const stuffToTest: (string | undefined)[] = [
            'stuff',
            undefined,
            'derp',
        ];

        const onlyStrings: string[] = stuffToTest.filter(isTruthy);

        assert.deepStrictEqual(onlyStrings, [
            'stuff',
            'derp',
        ]);
    });

    it('should fail on falsy things', () => {
        assert.isFalse(falsyArray.some(isTruthy));
    });

    it('excludes falsy types', () => {
        const stuffToTest = [
            ...falsyArray,
            'hello there',
        ] as const;

        const filtered = stuffToTest.filter(isTruthy);

        assert.typeOf(filtered).toMatchTypeOf<string[]>();
        assert.typeOf(stuffToTest).not.toMatchTypeOf<string[]>();
    });
});

describe(ifTruthy.name, () => {
    it('calls ifTruthyCallback when input is truthy', () => {
        truthyArray.forEach((truthyEntry) => {
            assert.strictEqual(
                ifTruthy(
                    truthyEntry,
                    () => 42,
                    () => false,
                ),
                42,
            );
        });
    });
    it('calls ifFalsyCallback when input is falsy', () => {
        falsyArray.forEach((truthyEntry) => {
            assert.strictEqual(
                ifTruthy(
                    truthyEntry,
                    () => 42,
                    () => false,
                ),
                false,
            );
        });
    });
    it('has return type of both callbacks', () => {
        assert
            .typeOf(
                ifTruthy(
                    Math.random() > 0.5 ? 'five' : 0,
                    (truthy) => {
                        assert.typeOf(truthy).toEqualTypeOf<'five'>();
                        return {truthy: true};
                    },
                    (falsy) => {
                        assert.typeOf(falsy).toEqualTypeOf<0>();
                        return {falsy: true};
                    },
                ),
            )
            .toEqualTypeOf<{truthy: boolean} | {falsy: boolean}>();
    });
});

describe('Truthy', () => {
    it('excludes falsy types', () => {
        assert.typeOf<Truthy<string | undefined>>().toEqualTypeOf<string>();
        assert.typeOf<Truthy<string | null>>().toEqualTypeOf<string>();
        assert.typeOf<Truthy<string | false>>().toEqualTypeOf<string>();
        assert.typeOf<Truthy<string | 0>>().toEqualTypeOf<string>();
        assert.typeOf<Truthy<string>>().toEqualTypeOf<string>();
        assert.typeOf<Truthy<string | -0>>().toEqualTypeOf<string>();
        assert.typeOf<Truthy<string | 0n>>().toEqualTypeOf<string>();
    });
});
