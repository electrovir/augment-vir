import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type WritableKeysOf} from './writable-keys-of.js';

type Mixed = {
    readonly a: number;
    b: string;
    readonly c: boolean;
    d: number;
};

describe('WritableKeysOf', () => {
    it('extracts only the writable keys', () => {
        assert.tsType<WritableKeysOf<Mixed>>().equals<'b' | 'd'>();
    });

    it('returns never when there are no writable keys', () => {
        assert.tsType<WritableKeysOf<{readonly a: number; readonly b: string}>>().equals<never>();
    });

    it('returns all keys when everything is writable', () => {
        assert.tsType<WritableKeysOf<{a: number; b: string}>>().equals<'a' | 'b'>();
    });

    it('distributes over unions', () => {
        assert
            .tsType<WritableKeysOf<{readonly a: number; b: string} | {c: boolean}>>()
            .equals<'b' | 'c'>();
    });
});
