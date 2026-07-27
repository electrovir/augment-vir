import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type If, type IfNotAnyOrNever} from './conditional-type.js';

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

describe('IfNotAnyOrNever', () => {
    it('resolves the main branch for ordinary types', () => {
        assert.tsType<IfNotAnyOrNever<string, 'main'>>().equals<'main'>();
        assert.tsType<IfNotAnyOrNever<{a: number}, 'main'>>().equals<'main'>();
        assert.tsType<IfNotAnyOrNever<unknown, 'main'>>().equals<'main'>();
    });

    it('defaults to `any` for `any` and `never` for `never`', () => {
        assert.tsType<IfNotAnyOrNever<any, 'main'>>().equals<any>();
        assert.tsType<IfNotAnyOrNever<never, 'main'>>().equals<never>();
    });

    it('resolves the explicit any and never branches when given', () => {
        assert.tsType<IfNotAnyOrNever<any, 'main', 'isAny', 'isNever'>>().equals<'isAny'>();
        assert.tsType<IfNotAnyOrNever<never, 'main', 'isAny', 'isNever'>>().equals<'isNever'>();
        assert.tsType<IfNotAnyOrNever<string, 'main', 'isAny', 'isNever'>>().equals<'main'>();
    });
});
