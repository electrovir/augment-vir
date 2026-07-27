import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type LiteralUnion} from './literal-union.js';

type Pet = LiteralUnion<'cat' | 'dog', string>;
type Level = LiteralUnion<1 | 2 | 3, number>;

describe('LiteralUnion', () => {
    it('accepts the declared literals', () => {
        assert.tsType<'cat'>().matches<Pet>();
        assert.tsType<'dog'>().matches<Pet>();
    });

    it('accepts arbitrary values of the base type', () => {
        assert.tsType<'fish'>().matches<Pet>();

        const anyString: Pet = 'anything';
        assert.tsType(anyString).matches<Pet>();
    });

    it('is mutually assignable with its base type', () => {
        assert.tsType<Pet>().matches<string>();
        assert.tsType<string>().matches<Pet>();
    });

    it('rejects values outside the base type', () => {
        // @ts-expect-error: a number is not assignable to a string-based literal union
        const wrong: Pet = 123;
    });

    it('supports non-string base types', () => {
        assert.tsType<2>().matches<Level>();
        assert.tsType<42>().matches<Level>();

        // @ts-expect-error: a string is not assignable to a number-based literal union
        const wrong: Level = 'nope';
    });
});
