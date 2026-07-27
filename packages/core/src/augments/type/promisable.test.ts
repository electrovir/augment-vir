import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type Promisable} from './promisable.js';

describe('Promisable', () => {
    it('allows the bare value', () => {
        assert.tsType<string>().matches<Promisable<string>>();
    });

    it('allows a PromiseLike of the value', () => {
        assert.tsType<Promise<string>>().matches<Promisable<string>>();
    });

    it('resolves to the union of the value and its PromiseLike', () => {
        assert.tsType<Promisable<number>>().equals<number | PromiseLike<number>>();
    });

    it('does not allow an unrelated type', () => {
        assert.tsType<number>().notMatches<Promisable<string>>();
    });
});
