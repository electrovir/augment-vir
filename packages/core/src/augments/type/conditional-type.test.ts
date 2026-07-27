import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type If} from './conditional-type.js';

describe('If', () => {
    it('resolves the true branch for `true`', () => {
        assert.tsType<If<true, string, number>>().equals<string>();
    });

    it('resolves the false branch for `false`', () => {
        assert.tsType<If<false, string, number>>().equals<number>();
    });

    it('unions both branches for `boolean`', () => {
        assert.tsType<If<boolean, string, number>>().equals<string | number>();
    });

    it('unions both branches for `any`', () => {
        assert.tsType<If<any, string, number>>().equals<string | number>();
    });

    it('resolves the else branch for `never`', () => {
        assert.tsType<If<never, string, number>>().equals<number>();
    });
});
