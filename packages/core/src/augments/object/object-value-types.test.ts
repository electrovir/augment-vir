import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type CompleteValues, type ValueAtRequiredKey, type Values} from './object-value-types.js';

describe('Values', () => {
    it('extracts value types from a plain object', () => {
        assert.tsType<Values<{a: 1; b: 'x'}>>().equals<1 | 'x'>();
    });

    it('extracts element types from a readonly tuple without leaking length', () => {
        assert
            .tsType<
                Values<
                    readonly [
                        10,
                        20,
                        30,
                    ]
                >
            >()
            .equals<10 | 20 | 30>();
    });

    it('extracts element types from a mutable tuple without leaking length', () => {
        assert
            .tsType<
                Values<
                    [
                        10,
                        20,
                        30,
                    ]
                >
            >()
            .equals<10 | 20 | 30>();
    });

    it('returns the element type for a regular array', () => {
        assert.tsType<Values<number[]>>().equals<number>();
        assert.tsType<Values<ReadonlyArray<string>>>().equals<string>();
    });

    it('does not include array method types for tuples', () => {
        assert
            .tsType<
                Values<
                    readonly [
                        'a',
                        'b',
                    ]
                >
            >()
            .equals<'a' | 'b'>();
    });
});

describe('CompleteValues', () => {
    it('extracts value types when keys are optional', () => {
        assert.tsType<CompleteValues<{a?: 1; b?: 'x'}>>().equals<1 | 'x'>();
    });
});

describe('ValueAtRequiredKey', () => {
    it('extracts the value type at a required key', () => {
        assert.tsType<ValueAtRequiredKey<{a?: 1; b?: 'x'}, 'a'>>().equals<1>();
    });
});
