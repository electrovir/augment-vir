import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type NegativeInfinity, type PositiveInfinity} from '../number/infinity.js';
import {type Subtract} from './subtract.js';

describe('Subtract', () => {
    it('subtracts two positive numbers', () => {
        assert.tsType<Subtract<333, 222>>().equals<111>();
        assert.tsType<Subtract<10, 3>>().equals<7>();
    });

    it('produces a negative result when the minuend is smaller', () => {
        assert.tsType<Subtract<18, 96>>().equals<-78>();
    });

    it('subtracts two negative numbers', () => {
        assert.tsType<Subtract<-111, -222>>().equals<111>();
    });

    it('returns zero when the operands are equal', () => {
        assert.tsType<Subtract<100, 100>>().equals<0>();
    });

    it('handles zero operands', () => {
        assert.tsType<Subtract<5, 0>>().equals<5>();
        assert.tsType<Subtract<0, 5>>().equals<-5>();
    });

    it('handles infinity operands', () => {
        assert.tsType<Subtract<PositiveInfinity, 1>>().equals<PositiveInfinity>();
        assert.tsType<Subtract<1, PositiveInfinity>>().equals<NegativeInfinity>();
        assert.tsType<Subtract<NegativeInfinity, 1>>().equals<NegativeInfinity>();
    });

    it('widens to number when an operand is the general number type', () => {
        assert.tsType<Subtract<number, 1>>().equals<number>();
    });
});
