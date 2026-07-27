import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type UnknownArray} from './unknown-array.js';

type IsArray<T> = T extends UnknownArray ? true : false;

describe('UnknownArray', () => {
    it('accepts any array', () => {
        assert.tsType<readonly []>().matches<UnknownArray>();
        assert.tsType<unknown[]>().matches<UnknownArray>();
        assert.tsType([]).matches<UnknownArray>();
        assert.tsType(['foo']).matches<UnknownArray>();
    });

    it('rejects non-array values', () => {
        assert.tsType(null).notMatches<UnknownArray>();
        assert.tsType(undefined).notMatches<UnknownArray>();
        assert.tsType({}).notMatches<UnknownArray>();
        assert
            .tsType({
                0: 1,
            })
            .notMatches<UnknownArray>();
        assert.tsType(1).notMatches<UnknownArray>();
        assert.tsType(Date).notMatches<UnknownArray>();
    });

    it('resolves to a match in conditional position for arrays, tuples, and spreads', () => {
        assert.tsType<IsArray<string>>().equals<false>();
        assert.tsType<IsArray<[]>>().equals<true>();
        assert.tsType<IsArray<['foo']>>().equals<true>();
        assert.tsType<IsArray<readonly number[]>>().equals<true>();
        assert
            .tsType<
                IsArray<
                    readonly [
                        number,
                        ...string[],
                    ]
                >
            >()
            .equals<true>();
        assert
            .tsType<
                IsArray<
                    readonly [
                        ...string[],
                        number,
                    ]
                >
            >()
            .equals<true>();
    });
});
