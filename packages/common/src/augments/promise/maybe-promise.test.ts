import {describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {MaybePromise} from './maybe-promise.js';

describe('MaybePromise', ({it}) => {
    it('wraps in a promise', () => {
        assertTypeOf<MaybePromise<string>>().toEqualTypeOf<string | Promise<string>>();
        /** You have manually unwrap nested promises. */
        assertTypeOf<MaybePromise<Promise<string>>>().not.toEqualTypeOf<string | Promise<string>>();
    });
});
