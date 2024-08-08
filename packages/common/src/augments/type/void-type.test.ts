import {describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {RequireNonVoid} from './void-type.js';

describe('RequireNonVoid', ({it}) => {
    it('blocks void values', () => {
        assertTypeOf<RequireNonVoid<void, 'success', 'failure'>>().toEqualTypeOf<'failure'>();
        assertTypeOf<RequireNonVoid<void, 'success', 'failure'>>().not.toEqualTypeOf<'success'>();
    });
    it('allows non-void values', () => {
        assertTypeOf<RequireNonVoid<undefined, 'success', 'failure'>>().toEqualTypeOf<'success'>();
        assertTypeOf<RequireNonVoid<undefined, 'success', 'failure'>>().toEqualTypeOf<'success'>();
    });
});
