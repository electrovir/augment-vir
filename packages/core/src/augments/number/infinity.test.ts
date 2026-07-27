import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type NegativeInfinity, type PositiveInfinity} from './infinity.js';

describe('PositiveInfinity', () => {
    it('is assignable to number', () => {
        assert.tsType<PositiveInfinity>().matches<number>();
    });

    it('is a distinct type from NegativeInfinity', () => {
        assert.tsType<PositiveInfinity>().notEquals<NegativeInfinity>();
        assert.tsType<PositiveInfinity>().notMatches<NegativeInfinity>();
    });

    it('is not satisfied by a generic number', () => {
        assert.tsType<number>().notMatches<PositiveInfinity>();
    });

    it('does not accept the runtime Infinity value', () => {
        // @ts-expect-error: the runtime `Infinity` value is typed as `number`, not the literal type.
        const value: PositiveInfinity = Infinity;
    });
});

describe('NegativeInfinity', () => {
    it('is assignable to number', () => {
        assert.tsType<NegativeInfinity>().matches<number>();
    });

    it('is a distinct type from PositiveInfinity', () => {
        assert.tsType<NegativeInfinity>().notEquals<PositiveInfinity>();
        assert.tsType<NegativeInfinity>().notMatches<PositiveInfinity>();
    });

    it('is not satisfied by a generic number', () => {
        assert.tsType<number>().notMatches<NegativeInfinity>();
    });
});
