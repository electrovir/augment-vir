import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type InverseBoolean} from './boolean.js';

describe('InverseBoolean', () => {
    it('inverts true', () => {
        assert.tsType<InverseBoolean<true>>().equals<false>();
    });
    it('inverts false', () => {
        assert.tsType<InverseBoolean<false>>().equals<true>();
    });
    it('inverts undefined', () => {
        assert.tsType<InverseBoolean<undefined>>().equals<true>();
    });
});
