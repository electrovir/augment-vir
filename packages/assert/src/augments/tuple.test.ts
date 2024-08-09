import {describe, it} from '@augment-vir/test/src/augments/universal-testing-suite/index.js';
import {assert} from './assert/assert.js';
import {Tuple} from './tuple.js';

describe('Tuple', () => {
    it('has proper types', () => {
        assert.typeOf<[string, string]>().toEqualTypeOf<Tuple<string, 2>>();
        assert.typeOf<['a', 'b']>().not.toEqualTypeOf<Tuple<string, 2>>();
    });
});
