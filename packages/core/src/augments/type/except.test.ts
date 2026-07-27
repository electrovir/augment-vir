import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type Except} from './except.js';

describe('Except', () => {
    it('removes the given key', () => {
        assert.tsType<Except<{a: number; b: string}, 'b'>>().equals<{a: number}>();
    });

    it('disallows accessing an omitted key', () => {
        const value: Except<{a: number; b: string}, 'b'> = {
            a: 1,
        };
        // @ts-expect-error: `b` was omitted.
        const b: unknown = value.b;
    });

    it('allows extra properties by default', () => {
        const nonStrict = {
            a: 1,
            b: '2',
        };
        const nonStrictAssignment: Except<{a: number; b: string}, 'b'> = nonStrict;
        assert.tsType(nonStrictAssignment).matches<{a: number}>();
    });

    it('disallows extra properties with requireExactProps', () => {
        const nonStrict = {
            a: 1,
            b: '2',
        };
        // @ts-expect-error: `requireExactProps` disallows the extra `b` property.
        const strictAssignment: Except<{a: number; b: string}, 'b', {requireExactProps: true}> =
            nonStrict;
    });

    it('preserves index signatures', () => {
        type Example = {
            [key: string]: unknown;
            foo: number;
            bar: string;
        };

        const test: Except<Example, 'bar', {requireExactProps: false}> = {
            foo: 123,
            bar: 'asdf',
        };
        assert.tsType(test.foo).equals<number>();
        assert.tsType(test['bar']).equals<unknown>();
    });
});
