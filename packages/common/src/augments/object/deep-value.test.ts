import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {getDeepValue, type DeepValue} from './deep-value.js';

describe('DeepValue', () => {
    it('works with a single key', () => {
        assert.tsType<DeepValue<{a: string}, ['a']>>().equals<string>();
    });
    it('falls back to undefined', () => {
        assert.tsType<DeepValue<{a: string}, ['a', 'b']>>().equals<undefined>();
    });
    it('accesses a nested key', () => {
        assert
            .tsType<
                DeepValue<
                    {a: {b: {c: number}; d: {e: string}; f: {g: {h: RegExp}}}},
                    ['a', 'b', 'c']
                >
            >()
            .equals<number>();
    });
    it('handles union keys', () => {
        assert
            .tsType<
                DeepValue<
                    {a: {b: {c: number}; d: {e: string}; f: {g: {h: RegExp}}}},
                    ['a', 'b' | 'd', 'c' | 'e']
                >
            >()
            .equals<string | number | undefined>();
    });
});

describe(getDeepValue.name, () => {
    itCases(getDeepValue<any, any>, [
        {
            it: 'handles a single key',
            inputs: [
                {
                    a: 'hi',
                },
                ['a'],
            ],
            expect: 'hi',
        },
        {
            it: 'falls back to undefined',
            inputs: [
                {
                    a: 'hi',
                },
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
            expect: undefined,
        },
        {
            it: 'accesses a nested key',
            inputs: [
                {
                    a: {
                        b: {
                            c: 'bye',
                        },
                    },
                },
                [
                    'a',
                    'b',
                    'c',
                ],
            ],
            expect: 'bye',
        },
    ]);

    it('has proper types', () => {
        assert
            .tsType(
                getDeepValue(
                    {
                        a: {
                            b: {
                                c: 'hi',
                            },
                        },
                    },
                    [
                        'a',
                        'b',
                        'c',
                    ],
                ),
            )
            .equals<'hi'>();
    });
});
