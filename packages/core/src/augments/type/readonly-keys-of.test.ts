import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type ReadonlyKeysOf} from './readonly-keys-of.js';

type Mixed = {
    readonly a: number;
    b: string;
    readonly c: boolean;
    d: number;
};

describe('ReadonlyKeysOf', () => {
    it('extracts only the readonly keys', () => {
        assert.tsType<ReadonlyKeysOf<Mixed>>().equals<'a' | 'c'>();
    });

    it('returns never when there are no readonly keys', () => {
        assert.tsType<ReadonlyKeysOf<{a: number; b: string}>>().equals<never>();
    });

    it('returns all keys when everything is readonly', () => {
        assert
            .tsType<ReadonlyKeysOf<{readonly a: number; readonly b: string}>>()
            .equals<'a' | 'b'>();
    });

    it('distributes over unions', () => {
        assert
            .tsType<ReadonlyKeysOf<{readonly a: number; b: string} | {readonly c: boolean}>>()
            .equals<'a' | 'c'>();
    });
});
