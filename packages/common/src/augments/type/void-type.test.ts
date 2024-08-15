import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {RequireNonVoid} from './void-type.js';

describe('RequireNonVoid', () => {
    it('blocks void values', () => {
        assert.tsType<RequireNonVoid<void, 'success', 'failure'>>().equals<'failure'>();
        assert.tsType<RequireNonVoid<void, 'success', 'failure'>>().notEquals<'success'>();
    });
    it('allows non-void values', () => {
        assert.tsType<RequireNonVoid<undefined, 'success', 'failure'>>().equals<'success'>();
        assert.tsType<RequireNonVoid<undefined, 'success', 'failure'>>().equals<'success'>();
    });
});
