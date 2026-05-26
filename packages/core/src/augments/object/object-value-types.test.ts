import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type CompleteValues, type ValueAtRequiredKey, type Values} from './object-value-types.js';

describe('Values', () => {
    it('extracts value types from a plain object', () => {
        assert.tsType<Values<{a: 1; b: 'x'}>>().equals<1 | 'x'>();
    });

    it('messes up arrays (use ArrayElement instead)', () => {
        type Result = Values<
            readonly [
                10,
                20,
                30,
            ]
        >;

        assert.tsType<Result>().notEquals<10 | 20 | 30>();
        assert.tsType<Result>().notEquals<number>();
        assert
            .tsType<
                Values<
                    readonly [
                        'a',
                        'b',
                    ]
                >
            >()
            .notEquals<'a' | 'b'>();
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
