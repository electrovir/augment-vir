import {describe, it} from '../test-suite.mock.js';
import {assert} from './assert/assert.js';
import {falsyArray, truthyArray} from './boolean.mock.js';
import {Falsy, isFalsy} from './falsy.js';

describe(isFalsy.name, () => {
    it('returns false for various truthy things', () => {
        assert.isFalse(truthyArray.some(isFalsy));
    });

    it('filters out truthy types', () => {
        const stuffToTest: (string | undefined)[] = [
            'stuff',
            undefined,
            'derp',
        ];

        const onlyFalsy: undefined[] = stuffToTest.filter(isFalsy);

        assert.deepStrictEqual(onlyFalsy, [
            undefined,
        ]);
    });

    it('accepts falsy things', () => {
        assert.isTrue(falsyArray.every(isFalsy));
    });

    it('includes falsy types', () => {
        const stuffToTest = [
            ...falsyArray,
            'hello there',
        ] as const;

        const filtered = stuffToTest.filter(isFalsy);

        assert.typeOf(filtered).toMatchTypeOf<(undefined | false | 0 | '' | null)[]>();
        assert.typeOf(stuffToTest).not.toMatchTypeOf<(undefined | false | 0 | '' | null)[]>();
    });
});

describe('Falsy', () => {
    it('excludes truthy types', () => {
        assert.typeOf<Falsy<string | undefined>>().toEqualTypeOf<undefined>();
        assert.typeOf<Falsy<string | null>>().toEqualTypeOf<null>();
        assert.typeOf<Falsy<string | false>>().toEqualTypeOf<false>();
        assert.typeOf<Falsy<string | 0>>().toEqualTypeOf<0>();
        assert.typeOf<Falsy<string>>().toEqualTypeOf<never>();
        assert.typeOf<Falsy<string | -0>>().toEqualTypeOf<-0>();
        assert.typeOf<Falsy<string | 0n>>().toEqualTypeOf<0n>();
    });
});
