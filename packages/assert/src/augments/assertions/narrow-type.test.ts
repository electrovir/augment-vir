import {AnyFunction, type AnyObject} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {assert} from '../guards/assert.js';
import type {FalsyValue} from './boolean.js';
import {NarrowToActual, NarrowToExpected} from './narrow-type.js';

describe('narrow-type', () => {
    it('extracts a subset', () => {
        assert
            .typeOf<NarrowToExpected<string | undefined, FalsyValue>>()
            .toEqualTypeOf<'' | undefined>();
        assert.typeOf<NarrowToActual<string | undefined, FalsyValue>>().toEqualTypeOf<undefined>();
    });
    it('can be used on a type guard', () => {
        function isFunction<Actual>(
            input: Actual,
        ): asserts input is NarrowToExpected<Actual, AnyFunction> {}
    });
    it('narrows a function', () => {
        assert
            .typeOf<NarrowToExpected<(() => string) | AnyObject, AnyFunction>>()
            .not.toEqualTypeOf<() => string>();
        assert
            .typeOf<NarrowToActual<(() => string) | AnyObject, AnyFunction>>()
            .toEqualTypeOf<() => string>();
    });
});
