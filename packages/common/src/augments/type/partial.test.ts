import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type MakePartial} from './partial.js';

describe('MakePartial', () => {
    it('sets as partial', () => {
        assert.tsType<MakePartial<{a: string}, true>>().equals<Partial<{a: string}>>();
    });
    it('does not set as partial', () => {
        assert.tsType<MakePartial<{a: string}, false>>().equals<{a: string}>();
    });
    it('keeps partials as partial', () => {
        assert
            .tsType<MakePartial<{a: string; b?: string}, false>>()
            .equals<{a: string; b?: string}>();
    });
});
