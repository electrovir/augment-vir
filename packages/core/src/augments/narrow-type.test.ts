import {assert, type FalsyValue} from '@augment-vir/assert';
import {type AnyFunction, type AnyObject} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {type NarrowToActual, type NarrowToExpected} from './narrow-type.js';

describe('narrow-type', () => {
    it('extracts a subset', () => {
        assert.tsType<NarrowToExpected<string | undefined, FalsyValue>>().equals<'' | undefined>();
        assert.tsType<NarrowToActual<string | undefined, FalsyValue>>().equals<undefined>();
    });
    it('can be used on a type guard', () => {
        function isFunction<Actual>(
            input: Actual,
        ): asserts input is NarrowToExpected<Actual, AnyFunction> {}

        const value = (() => 'hi') as (() => string) | string;
        isFunction(value);
        assert.tsType(value).equals<() => string>();
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
