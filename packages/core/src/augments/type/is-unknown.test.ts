import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type IsNull, type IsUnknown} from './is-unknown.js';

describe('IsUnknown', () => {
    it('is true only for unknown', () => {
        assert.tsType<IsUnknown<unknown>>().equals<true>();
    });

    it('is false for non-unknown types', () => {
        assert.tsType<IsUnknown<string>>().equals<false>();
        assert.tsType<IsUnknown<'something'>>().equals<false>();
        assert.tsType<IsUnknown<any>>().equals<false>();
        assert.tsType<IsUnknown<never>>().equals<false>();
        assert.tsType<IsUnknown<null>>().equals<false>();
        assert.tsType<IsUnknown<undefined>>().equals<false>();
        assert.tsType<IsUnknown<void>>().equals<false>();
    });
});

describe('IsNull', () => {
    it('is true for null, any, and never', () => {
        assert.tsType<IsNull<null>>().equals<true>();
        assert.tsType<IsNull<any>>().equals<true>();
        assert.tsType<IsNull<never>>().equals<true>();
    });

    it('is false for other types', () => {
        assert.tsType<IsNull<undefined>>().equals<false>();
        assert.tsType<IsNull<unknown>>().equals<false>();
        assert.tsType<IsNull<void>>().equals<false>();
        assert.tsType<IsNull<{a: number}>>().equals<false>();
    });
});
