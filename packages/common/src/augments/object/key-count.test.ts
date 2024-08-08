import {describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {AnyObject} from './generic-object-type.js';
import {KeyCount} from './key-count.js';

describe('KeyCount', ({it}) => {
    it('counts keys', () => {
        assertTypeOf<KeyCount<Record<'a' | 'b' | 'c' | 'd', any>>>().toEqualTypeOf<4>();
        const value = {a: 'hi', b: 'c'};
        assertTypeOf<KeyCount<typeof value>>().toEqualTypeOf<2>();
        assertTypeOf<KeyCount<Record<string, any>>>().toEqualTypeOf<1>();
        assertTypeOf<KeyCount<AnyObject>>().toEqualTypeOf<3>();
    });

    it('does not work on arrays', () => {
        assertTypeOf<KeyCount<['hi', 'b']>>().not.toEqualTypeOf<2>();
    });
});
