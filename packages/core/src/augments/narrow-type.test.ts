import type {FalsyValue} from '@augment-vir/assert';
import {assert} from '@augment-vir/assert';
import {AnyFunction, type AnyObject} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {NarrowToActual, NarrowToExpected} from './narrow-type.js';

describe('narrow-type', () => {
    it('extracts a subset', () => {
        assert.tsType<NarrowToExpected<string | undefined, FalsyValue>>().equals<'' | undefined>();
        assert.tsType<NarrowToActual<string | undefined, FalsyValue>>().equals<undefined>();
    });
    it('can be used on a type guard', () => {
        function isFunction<Actual>(
            input: Actual,
        ): asserts input is NarrowToExpected<Actual, AnyFunction> {}
    });
    it('narrows a function', () => {
        assert
            .tsType<NarrowToExpected<(() => string) | AnyObject, AnyFunction>>()
            .notEquals<() => string>();
        assert
            .tsType<NarrowToActual<(() => string) | AnyObject, AnyFunction>>()
            .equals<() => string>();
    });
});
