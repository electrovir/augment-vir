import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type Primitive} from './primitive-type.js';

describe('Primitive', () => {
    it('equals the union of every primitive type', () => {
        assert
            .tsType<Primitive>()
            .equals<null | undefined | string | number | boolean | symbol | bigint>();
    });

    it('matches every primitive value', () => {
        assert.tsType<string>().matches<Primitive>();
        assert.tsType<number>().matches<Primitive>();
        assert.tsType<boolean>().matches<Primitive>();
        assert.tsType<symbol>().matches<Primitive>();
        assert.tsType<bigint>().matches<Primitive>();
        assert.tsType<null>().matches<Primitive>();
        assert.tsType<undefined>().matches<Primitive>();
        assert.tsType<'literal'>().matches<Primitive>();
        assert.tsType<42>().matches<Primitive>();
        assert.tsType<true>().matches<Primitive>();
    });

    it('does not match non-primitive values', () => {
        assert.tsType<{a: number}>().notMatches<Primitive>();
        assert.tsType<string[]>().notMatches<Primitive>();
        assert.tsType<() => void>().notMatches<Primitive>();
        assert.tsType<Date>().notMatches<Primitive>();
    });
});
