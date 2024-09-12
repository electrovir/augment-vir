import {describe, it, itCases} from '@augment-vir/test';
import {AssertionError} from '../augments/assertion.error.js';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';
import type {
    OutputAssertWithoutAsserter,
    OutputAssertWrapWithoutAsserter,
    OutputCheckWithoutAsserter,
} from './output.js';
import {OutputCheckWrapWithoutAsserter, OutputWaitUntilWithoutAsserter} from './output.js';

describe('output', () => {
    describe('assert', () => {
        it('requires correct output type without custom asserter', () => {
            assert.throws(() =>
                assert.output(
                    (input: number) => String(input),
                    [5],
                    // @ts-expect-error: this should be a string
                    42,
                ),
            );
        });
        it('requires correct input type without custom asserter', () => {
            assert.throws(() =>
                assert.output(
                    (input: number) => String(input),
                    // @ts-expect-error: this should be a number
                    ['wrong type'],
                    '5',
                ),
            );
        });
        it('works with multiple function inputs without custom asserter', () => {
            assert.output(
                (input: number, input2: string) => String(input),
                [
                    5,
                    'word',
                ],
                '5',
            );
        });
        it('works without custom asserter', () => {
            assert.output((input: number) => String(input), [5], '5');
        });

        it('requires correct output type without custom asserter and async callback', async () => {
            await assert.throws(async () => {
                const result = assert.output(
                    (input: number) => Promise.resolve(String(input)),
                    [5],
                    // @ts-expect-error: this should be a string
                    42,
                );
                assert.tsType(result).equals<Promise<void>>();
                assert.isPromise(result);

                await result;
            });
        });
        it('requires correct input type without custom asserter and async callback', async () => {
            await assert.throws(async () => {
                const result = assert.output(
                    (input: number) => Promise.resolve(String(input)),
                    // @ts-expect-error: this should be a number
                    ['wrong type'],
                    '5',
                );
                assert.tsType(result).equals<Promise<void>>();
                assert.isPromise(result);

                await result;
            });
        });
        it('works with multiple function inputs without custom asserter and async callback', async () => {
            const result = assert.output(
                (input: number, input2: string) => Promise.resolve(String(input)),
                [
                    5,
                    'word',
                ],
                '5',
            );
            assert.tsType(result).equals<Promise<void>>();
            assert.isPromise(result);

            await result;
        });
        it('works without custom asserter and async callback', async () => {
            const result = assert.output(
                (input: number) => Promise.resolve(String(input)),
                [5],
                '5',
            );
            assert.tsType(result).equals<Promise<void>>();
            assert.isPromise(result);

            await result;
        });

        it('requires correct output type with custom asserter', () => {
            // @ts-expect-error: expected output should be a string
            assert.output(assert.notStrictEquals, (input: number) => String(input), [5], 42);
        });
        it('requires correct input type with custom asserter', () => {
            // @ts-expect-error: expected output should be a number
            assert.output(
                assert.notStrictEquals,
                (input: number) => String(input),
                ['wrong type'],
                '5',
            );
        });
        it('works with multiple function inputs with custom asserter', () => {
            assert.output(
                assert.notStrictEquals,
                (input: number, input2: string) => String(input),
                [
                    5,
                    'word',
                ],
                'not equal',
            );
        });
        it('works with custom asserter', () => {
            assert.output(
                assert.notStrictEquals,
                (input: number) => String(input),
                [5],
                'not equal',
            );
        });

        itCases(assert.output as OutputAssertWithoutAsserter, [
            {
                it: 'passes when the values match',
                inputs: [
                    () => 'five',
                    [],
                    'five',
                ],
                throws: undefined,
            },
            {
                it: 'passes when the values match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'first',
                        45,
                    ],
                    'first,45',
                ],
                throws: undefined,
            },
            {
                it: 'fails when the values do not match',
                inputs: [
                    () => 'sixty',
                    [],
                    'fifty',
                ],
                throws: {
                    matchConstructor: AssertionError,
                },
            },
            {
                it: 'fails when the values do not match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'second',
                        67,
                    ],
                    'second,67',
                ],
                throws: undefined,
            },
            {
                it: 'passes for deep equality',
                inputs: [
                    () => {
                        return {
                            value: 'four',
                        };
                    },
                    [],
                    {value: 'four'},
                ],
                throws: undefined,
            },
            {
                it: 'passes for deep equality with inputs',
                inputs: [
                    (a: string, b: number) => {
                        return {
                            value: [
                                a,
                                b,
                            ].join(','),
                        };
                    },
                    [
                        'other',
                        46,
                    ],
                    {value: `other,46`},
                ],
                throws: undefined,
            },
            {
                it: 'fails for deep inequality',
                inputs: [
                    () => {
                        return {
                            value: 'seventy-two',
                        };
                    },
                    [],
                    {value: 'thirty-three'},
                ],
                throws: {
                    matchConstructor: AssertionError,
                },
            },
        ]);
    });

    describe('check', () => {
        it('requires correct output type without custom asserter', () => {
            assert.isFalse(
                check.output(
                    (input: number) => String(input),
                    [5],
                    // @ts-expect-error: this should be a string
                    42,
                ),
            );
        });
        it('requires correct input type without custom asserter', () => {
            assert.isFalse(
                check.output(
                    (input: number) => String(input),
                    // @ts-expect-error: this should be a number
                    ['wrong type'],
                    '5',
                ),
            );
        });
        it('works with multiple function inputs without custom asserter', () => {
            assert.isTrue(
                check.output(
                    (input: number, input2: string) => String(input),
                    [
                        5,
                        'word',
                    ],
                    '5',
                ),
            );
        });
        it('works without custom asserter', () => {
            assert.isTrue(check.output((input: number) => String(input), [5], '5'));
        });

        it('requires correct output type without custom asserter and async callback', async () => {
            const result = check.output(
                (input: number) => Promise.resolve(String(input)),
                [5],
                // @ts-expect-error: this should be a string
                42,
            );
            assert.tsType(result).equals<Promise<boolean>>();
            assert.isPromise(result);

            assert.isFalse(await result);
        });
        it('requires correct input type without custom asserter and async callback', async () => {
            const result = check.output(
                (input: number) => Promise.resolve(String(input)),
                // @ts-expect-error: this should be a number
                ['wrong type'],
                '5',
            );
            assert.tsType(result).equals<Promise<boolean>>();
            assert.isPromise(result);

            assert.isFalse(await result);
        });
        it('works with multiple function inputs without custom asserter and async callback', async () => {
            const result = check.output(
                (input: number, input2: string) => Promise.resolve(String(input)),
                [
                    5,
                    'word',
                ],
                '5',
            );
            assert.tsType(result).equals<Promise<boolean>>();
            assert.isPromise(result);

            assert.isTrue(await result);
        });
        it('works without custom asserter and async callback', async () => {
            const result = check.output(
                (input: number) => Promise.resolve(String(input)),
                [5],
                '5',
            );
            assert.tsType(result).equals<Promise<boolean>>();
            assert.isPromise(result);

            assert.isTrue(await result);
        });

        it('requires correct output type with custom asserter', () => {
            assert.isTrue(
                // @ts-expect-error: expected output should be a string
                check.output(assert.notStrictEquals, (input: number) => String(input), [5], 42),
            );
        });
        it('requires correct input type with custom asserter', () => {
            assert.isTrue(
                // @ts-expect-error: expected output should be a number
                check.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    ['wrong type'],
                    '5',
                ),
            );
        });
        it('works with multiple function inputs with custom asserter', () => {
            assert.isTrue(
                check.output(
                    assert.notStrictEquals,
                    (input: number, input2: string) => String(input),
                    [
                        5,
                        'word',
                    ],
                    'not equal',
                ),
            );
        });
        it('works with custom asserter', () => {
            assert.isTrue(
                check.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    [5],
                    'not equal',
                ),
            );
        });

        itCases(check.output as OutputCheckWithoutAsserter, [
            {
                it: 'passes when the values match',
                inputs: [
                    () => 'five',
                    [],
                    'five',
                ],
                expect: true,
            },
            {
                it: 'passes when the values match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'first',
                        45,
                    ],
                    'first,45',
                ],
                expect: true,
            },
            {
                it: 'fails when the values do not match',
                inputs: [
                    () => 'sixty',
                    [],
                    'fifty',
                ],
                expect: false,
            },
            {
                it: 'fails when the values do not match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'second',
                        67,
                    ],
                    'second,67',
                ],
                expect: true,
            },
            {
                it: 'passes for deep equality',
                inputs: [
                    () => {
                        return {
                            value: 'four',
                        };
                    },
                    [],
                    {value: 'four'},
                ],
                expect: true,
            },
            {
                it: 'passes for deep equality with inputs',
                inputs: [
                    (a: string, b: number) => {
                        return {
                            value: [
                                a,
                                b,
                            ].join(','),
                        };
                    },
                    [
                        'other',
                        46,
                    ],
                    {value: `other,46`},
                ],
                expect: true,
            },
            {
                it: 'fails for deep inequality',
                inputs: [
                    () => {
                        return {
                            value: 'seventy-two',
                        };
                    },
                    [],
                    {value: 'thirty-three'},
                ],
                expect: false,
            },
        ]);
    });

    describe('assertWrap', () => {
        it('requires correct output type without custom asserter', () => {
            assert.throws(() =>
                assertWrap.output(
                    (input: number) => String(input),
                    [5],
                    // @ts-expect-error: this should be a string
                    42,
                ),
            );
        });
        it('requires correct input type without custom asserter', () => {
            assert.throws(() =>
                assertWrap.output(
                    (input: number) => String(input),
                    // @ts-expect-error: this should be a number
                    ['wrong type'],
                    '5',
                ),
            );
        });
        it('works with multiple function inputs without custom asserter', () => {
            assert.strictEquals(
                assertWrap.output(
                    (input: number, input2: string) => String(input),
                    [
                        5,
                        'word',
                    ],
                    '5',
                ),
                '5',
            );
        });
        it('works without custom asserter', () => {
            assert.strictEquals(
                assertWrap.output((input: number) => String(input), [5], '5'),
                '5',
            );
        });

        it('requires correct output type without custom asserter and async callback', async () => {
            await assert.throws(async () => {
                const result = assertWrap.output(
                    (input: number) => Promise.resolve(String(input)),
                    [5],
                    // @ts-expect-error: this should be a string
                    42,
                );
                assert.tsType(result).equals<Promise<string>>();
                assert.isPromise(result);

                await result;
            });
        });
        it('requires correct input type without custom asserter and async callback', async () => {
            await assert.throws(async () => {
                const result = assertWrap.output(
                    (input: number) => Promise.resolve(String(input)),
                    // @ts-expect-error: this should be a number
                    ['wrong type'],
                    '5',
                );
                assert.tsType(result).equals<Promise<string>>();
                assert.isPromise(result);

                await result;
            });
        });
        it('works with multiple function inputs without custom asserter and async callback', async () => {
            const result = assertWrap.output(
                (input: number, input2: string) => Promise.resolve(String(input)),
                [
                    5,
                    'word',
                ],
                '5',
            );
            assert.tsType(result).equals<Promise<string>>();
            assert.isPromise(result);

            assert.strictEquals(await result, '5');
        });
        it('works without custom asserter and async callback', async () => {
            const result = assertWrap.output(
                (input: number) => Promise.resolve(String(input)),
                [5],
                '5',
            );
            assert.tsType(result).equals<Promise<string>>();
            assert.isPromise(result);

            assert.strictEquals(await result, '5');
        });

        it('requires correct output type with custom asserter', () => {
            assert.strictEquals(
                // @ts-expect-error: expected output should be a string
                assertWrap.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    [5],
                    42,
                ),
                // @ts-expect-error: above type error messes this type up
                '5',
            );
        });
        it('requires correct input type with custom asserter', () => {
            assert.strictEquals(
                // @ts-expect-error: expected output should be a number
                assertWrap.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    ['wrong type'],
                    '5',
                ),
                // @ts-expect-error: above type error messes this type up
                'wrong type',
            );
        });
        it('works with multiple function inputs with custom asserter', () => {
            assert.strictEquals(
                assertWrap.output(
                    assert.notStrictEquals,
                    (input: number, input2: string) => String(input),
                    [
                        5,
                        'word',
                    ],
                    'not equal',
                ),
                '5',
            );
        });
        it('works with custom asserter', () => {
            assert.strictEquals(
                assertWrap.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    [5],
                    'not equal',
                ),
                '5',
            );
        });

        itCases(assertWrap.output as OutputAssertWrapWithoutAsserter, [
            {
                it: 'passes when the values match',
                inputs: [
                    () => 'five',
                    [],
                    'five',
                ],
                expect: 'five',
            },
            {
                it: 'passes when the values match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'first',
                        45,
                    ],
                    'first,45',
                ],
                expect: 'first,45',
            },
            {
                it: 'fails when the values do not match',
                inputs: [
                    () => 'sixty',
                    [],
                    'fifty',
                ],
                throws: {
                    matchConstructor: AssertionError,
                },
            },
            {
                it: 'fails when the values do not match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'second',
                        67,
                    ],
                    'second,67',
                ],
                expect: 'second,67',
            },
            {
                it: 'passes for deep equality',
                inputs: [
                    () => {
                        return {
                            value: 'four',
                        };
                    },
                    [],
                    {value: 'four'},
                ],
                expect: {value: 'four'},
            },
            {
                it: 'passes for deep equality with inputs',
                inputs: [
                    (a: string, b: number) => {
                        return {
                            value: [
                                a,
                                b,
                            ].join(','),
                        };
                    },
                    [
                        'other',
                        46,
                    ],
                    {value: `other,46`},
                ],
                expect: {value: `other,46`},
            },
            {
                it: 'fails for deep inequality',
                inputs: [
                    () => {
                        return {
                            value: 'seventy-two',
                        };
                    },
                    [],
                    {value: 'thirty-three'},
                ],
                throws: {
                    matchConstructor: AssertionError,
                },
            },
        ]);
    });

    describe('checkWrap', () => {
        it('requires correct output type without custom asserter', () => {
            assert.isUndefined(
                checkWrap.output(
                    (input: number) => String(input),
                    [5],
                    // @ts-expect-error: this should be a string
                    42,
                ),
            );
        });
        it('requires correct input type without custom asserter', () => {
            assert.isUndefined(
                checkWrap.output(
                    (input: number) => String(input),
                    // @ts-expect-error: this should be a number
                    ['wrong type'],
                    '5',
                ),
            );
        });
        it('works with multiple function inputs without custom asserter', () => {
            assert.strictEquals(
                checkWrap.output(
                    (input: number, input2: string) => String(input),
                    [
                        5,
                        'word',
                    ],
                    '5',
                ),
                '5',
            );
        });
        it('works without custom asserter', () => {
            assert.strictEquals(
                checkWrap.output((input: number) => String(input), [5], '5'),
                '5',
            );
        });

        it('requires correct output type without custom asserter and async callback', async () => {
            const result = checkWrap.output(
                (input: number) => Promise.resolve(String(input)),
                [5],
                // @ts-expect-error: this should be a string
                42,
            );
            assert.tsType(result).equals<Promise<string | undefined>>();
            assert.isPromise(result);

            assert.isUndefined(await result);
        });
        it('requires correct input type without custom asserter and async callback', async () => {
            const result = checkWrap.output(
                (input: number) => Promise.resolve(String(input)),
                // @ts-expect-error: this should be a number
                ['wrong type'],
                '5',
            );
            assert.tsType(result).equals<Promise<string | undefined>>();
            assert.isPromise(result);

            assert.isUndefined(await result);
        });
        it('works with multiple function inputs without custom asserter and async callback', async () => {
            const result = checkWrap.output(
                (input: number, input2: string) => Promise.resolve(String(input)),
                [
                    5,
                    'word',
                ],
                '5',
            );
            assert.tsType(result).equals<Promise<string | undefined>>();
            assert.isPromise(result);

            assert.strictEquals(await result, '5');
        });
        it('works without custom asserter and async callback', async () => {
            const result = checkWrap.output(
                (input: number) => Promise.resolve(String(input)),
                [5],
                '5',
            );
            assert.tsType(result).equals<Promise<string | undefined>>();
            assert.isPromise(result);

            assert.strictEquals(await result, '5');
        });

        it('requires correct output type with custom asserter', () => {
            assert.strictEquals(
                // @ts-expect-error: expected output should be a string
                checkWrap.output(assert.notStrictEquals, (input: number) => String(input), [5], 42),
                // @ts-expect-error: above type error messes this type up
                '5',
            );
        });
        it('requires correct input type with custom asserter', () => {
            assert.strictEquals(
                // @ts-expect-error: expected output should be a number
                checkWrap.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    ['wrong type'],
                    '5',
                ),
                // @ts-expect-error: above type error messes this type up
                'wrong type',
            );
        });
        it('works with multiple function inputs with custom asserter', () => {
            assert.strictEquals(
                checkWrap.output(
                    assert.notStrictEquals,
                    (input: number, input2: string) => String(input),
                    [
                        5,
                        'word',
                    ],
                    'not equal',
                ),
                '5',
            );
        });
        it('works with custom asserter', () => {
            assert.strictEquals(
                checkWrap.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    [5],
                    'not equal',
                ),
                '5',
            );
        });

        itCases(checkWrap.output as OutputCheckWrapWithoutAsserter, [
            {
                it: 'passes when the values match',
                inputs: [
                    () => 'five',
                    [],
                    'five',
                ],
                expect: 'five',
            },
            {
                it: 'passes when the values match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'first',
                        45,
                    ],
                    'first,45',
                ],
                expect: 'first,45',
            },
            {
                it: 'fails when the values do not match',
                inputs: [
                    () => 'sixty',
                    [],
                    'fifty',
                ],
                expect: undefined,
            },
            {
                it: 'fails when the values do not match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'second',
                        67,
                    ],
                    'second,67',
                ],
                expect: 'second,67',
            },
            {
                it: 'passes for deep equality',
                inputs: [
                    () => {
                        return {
                            value: 'four',
                        };
                    },
                    [],
                    {value: 'four'},
                ],
                expect: {value: 'four'},
            },
            {
                it: 'passes for deep equality with inputs',
                inputs: [
                    (a: string, b: number) => {
                        return {
                            value: [
                                a,
                                b,
                            ].join(','),
                        };
                    },
                    [
                        'other',
                        46,
                    ],
                    {value: `other,46`},
                ],
                expect: {value: `other,46`},
            },
            {
                it: 'fails for deep inequality',
                inputs: [
                    () => {
                        return {
                            value: 'seventy-two',
                        };
                    },
                    [],
                    {value: 'thirty-three'},
                ],
                expect: undefined,
            },
        ]);
    });

    describe('waitUntil', () => {
        it('requires correct output type without custom asserter', async () => {
            await assert.throws(() =>
                // @ts-expect-error: expected output be a string
                waitUntil.output((input: number) => String(input), [5], 42, waitUntilTestOptions),
            );
        });
        it('requires correct input type without custom asserter', async () => {
            await assert.throws(() =>
                // @ts-expect-error: expected output should be a number
                waitUntil.output(
                    (input: number) => String(input),
                    ['wrong type'],
                    '5',
                    waitUntilTestOptions,
                ),
            );
        });
        it('works with multiple function inputs without custom asserter', async () => {
            assert.strictEquals(
                await waitUntil.output(
                    (input: number, input2: string) => String(input),
                    [
                        5,
                        'word',
                    ],
                    '5',
                ),
                '5',
            );
        });
        it('works without custom asserter', async () => {
            assert.strictEquals(
                await waitUntil.output((input: number) => String(input), [5], '5'),
                '5',
            );
        });

        it('requires correct output type with custom asserter', async () => {
            assert.strictEquals(
                // @ts-expect-error: expected output should be a string
                await waitUntil.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    [5],
                    42,
                ),
                // @ts-expect-error: above type error messes this type up
                '5',
            );
        });
        it('requires correct input type with custom asserter', async () => {
            assert.strictEquals(
                // @ts-expect-error: expected output should be a number
                await waitUntil.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    ['wrong type'],
                    '5',
                ),
                // @ts-expect-error: above type error messes this type up
                'wrong type',
            );
        });
        it('works with multiple function inputs with custom asserter', async () => {
            assert.strictEquals(
                await waitUntil.output(
                    assert.notStrictEquals,
                    (input: number, input2: string) => String(input),
                    [
                        5,
                        'word',
                    ],
                    'not equal',
                ),
                '5',
            );
        });
        it('works with custom asserter', async () => {
            assert.strictEquals(
                await waitUntil.output(
                    assert.notStrictEquals,
                    (input: number) => String(input),
                    [5],
                    'not equal',
                ),
                '5',
            );
        });

        itCases(waitUntil.output as OutputWaitUntilWithoutAsserter, [
            {
                it: 'passes when the values match',
                inputs: [
                    () => 'five',
                    [],
                    'five',
                ],
                expect: 'five',
            },
            {
                it: 'passes when the values match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'first',
                        45,
                    ],
                    'first,45',
                ],
                expect: 'first,45',
            },
            {
                it: 'fails when the values do not match',
                inputs: [
                    () => 'sixty',
                    [],
                    'fifty',
                    waitUntilTestOptions,
                ],
                throws: {
                    matchConstructor: AssertionError,
                },
            },
            {
                it: 'fails when the values do not match with inputs',
                inputs: [
                    (a: string, b: number) =>
                        [
                            a,
                            b,
                        ].join(','),
                    [
                        'second',
                        67,
                    ],
                    'second,67',
                ],
                expect: 'second,67',
            },
            {
                it: 'passes for deep equality',
                inputs: [
                    () => {
                        return {
                            value: 'four',
                        };
                    },
                    [],
                    {value: 'four'},
                ],
                expect: {value: 'four'},
            },
            {
                it: 'passes for deep equality with inputs',
                inputs: [
                    (a: string, b: number) => {
                        return {
                            value: [
                                a,
                                b,
                            ].join(','),
                        };
                    },
                    [
                        'other',
                        46,
                    ],
                    {value: `other,46`},
                ],
                expect: {value: `other,46`},
            },
            {
                it: 'fails for deep inequality',
                inputs: [
                    () => {
                        return {
                            value: 'seventy-two',
                        };
                    },
                    [],
                    {value: 'thirty-three'},
                    waitUntilTestOptions,
                ],
                throws: {
                    matchConstructor: AssertionError,
                },
            },
        ]);
    });
});
