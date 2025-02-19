import {describe, it, itCases} from '@augment-vir/test';
import {AssertionError} from '../augments/assertion.error.js';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('endsWith', () => {
    const first = 'one';
    const last = 'two';
    const parentArray = [
        first,
        last,
    ];

    describe('assert', () => {
        itCases(assert.endsWith, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    last,
                ],
                throws: undefined,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    first,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not end with',
                },
            },
            {
                it: 'passes a string',
                inputs: [
                    first,
                    'e',
                ],
                throws: undefined,
            },
            {
                it: 'rejects a string',
                inputs: [
                    last,
                    'e',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not end with',
                },
            },
        ]);
        it('has proper types', () => {
            // @ts-expect-error: number cannot be the child of string[]
            assert.endsWith(
                [
                    'a',
                    'b',
                ],
                'b' as any as number,
            );
            assert.endsWith(
                [
                    'a',
                    'b',
                    3,
                ],
                3,
            );
            // @ts-expect-error: string parent must have a string child
            assert.endsWith('one', 'e' as any as number);
            assert.endsWith('one', 'e');
        });
    });
    describe('check', () => {
        itCases(check.endsWith, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: true,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: false,
            },
            {
                it: 'passes a string',
                inputs: [
                    first,
                    'e',
                ],
                expect: true,
            },
            {
                it: 'rejects a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: false,
            },
        ]);
        it('has proper types', () => {
            assert.isTrue(
                // @ts-expect-error: number cannot be the child of string[]
                check.endsWith(
                    [
                        'a',
                        'b',
                    ],
                    'b' as any as number,
                ),
            );
            assert.isTrue(
                check.endsWith(
                    [
                        'a',
                        'b',
                        3,
                    ],
                    3,
                ),
            );
            assert.isTrue(
                // @ts-expect-error: string parent must have a string child
                check.endsWith('one', 'e' as any as number),
            );
            assert.isTrue(check.endsWith('one', 'e'));
        });
    });
    describe('assertWrap', () => {
        itCases(assertWrap.endsWith, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    first,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not end with',
                },
            },
            {
                it: 'passes a string',
                inputs: [
                    first,
                    'e',
                ],
                expect: first,
            },
            {
                it: 'rejects a string',
                inputs: [
                    last,
                    'e',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not end with',
                },
            },
        ]);
        it('has proper types', () => {
            // @ts-expect-error: number cannot be the child of string[]
            assertWrap.endsWith(
                [
                    'a',
                    'b',
                ],
                'b' as any as number,
            );

            assertWrap.endsWith(
                [
                    'a',
                    'b',
                    3,
                ],
                3,
            );

            // @ts-expect-error: string parent must have a string child
            assertWrap.endsWith('one', 'e' as any as number);

            assertWrap.endsWith('one', 'e');
        });
    });
    describe('checkWrap', () => {
        itCases(checkWrap.endsWith, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: undefined,
            },
            {
                it: 'passes a string',
                inputs: [
                    first,
                    'e',
                ],
                expect: first,
            },
            {
                it: 'rejects a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: undefined,
            },
        ]);
        it('has proper types', () => {
            assert.isNotUndefined(
                // @ts-expect-error: number cannot be the child of string[]
                checkWrap.endsWith(
                    [
                        'a',
                        'b',
                    ],
                    'b' as any as number,
                ),
            );

            assert.isNotUndefined(
                checkWrap.endsWith(
                    [
                        'a',
                        'b',
                        3,
                    ],
                    3,
                ),
            );

            // @ts-expect-error: string parent must have a string child
            assert.isNotUndefined(checkWrap.endsWith('one', 'e' as any as number));

            assert.isNotUndefined(checkWrap.endsWith('one', 'e'));
        });
    });
    describe('waitUntil', () => {
        it('passes an array', async () => {
            const newValue = await waitUntil.endsWith(
                last,
                () => {
                    return parentArray;
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.deepEquals(newValue, parentArray);
        });
        it('passes a string', async () => {
            const newValue = await waitUntil.endsWith(
                'e',
                () => {
                    return first;
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.strictEquals(newValue, first);
            assert.isFalse(
                check.strictEquals(
                    newValue,
                    // @ts-expect-error: the value is more tightly typed than this
                    'e',
                ),
            );
        });
        it('has proper types', async () => {
            // @ts-expect-error: number cannot be the child of string[]
            await waitUntil.endsWith('b' as any as number, () => [
                'a',
                'b',
            ]);

            await waitUntil.endsWith(3, () => [
                'a',
                'b',
                3,
            ]);

            // @ts-expect-error: string parent must have a string child
            await waitUntil.endsWith('e' as any as number, () => 'one');

            await waitUntil.endsWith('e', () => 'one');
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.endsWith(
                    first,
                    () => {
                        return [];
                    },
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
describe('endsWithout', () => {
    const first = 'one';
    const last = 'two';
    const parentArray = [
        first,
        last,
    ];

    describe('assert', () => {
        itCases(assert.endsWithout, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    first,
                ],
                throws: undefined,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    last,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'ends with',
                },
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                throws: undefined,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'e',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'ends with',
                },
            },
        ]);
        it('has proper types', () => {
            // @ts-expect-error: number cannot be the child of string[]
            assert.endsWithout(
                [
                    'b',
                    'a',
                ],
                'b' as any as number,
            );
            assert.endsWithout(
                [
                    3,
                    'a',
                    'b',
                ],
                3,
            );
            // @ts-expect-error: string parent must have a string child
            assert.endsWithout('one', 'o' as any as number);
            assert.endsWithout('one', 'o');
        });
    });
    describe('check', () => {
        itCases(check.endsWithout, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: true,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: false,
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: true,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'e',
                ],
                expect: false,
            },
        ]);
        it('has proper types', () => {
            assert.isTrue(
                // @ts-expect-error: number cannot be the child of string[]
                check.endsWithout(
                    [
                        'b',
                        'a',
                    ],
                    'b' as any as number,
                ),
            );
            assert.isTrue(
                check.endsWithout(
                    [
                        3,
                        'a',
                        'b',
                    ],
                    3,
                ),
            );
            assert.isTrue(
                // @ts-expect-error: string parent must have a string child
                check.endsWithout('one', 'o' as any as number),
            );
            assert.isTrue(check.endsWithout('one', 'o'));
        });
    });
    describe('assertWrap', () => {
        itCases(assertWrap.endsWithout, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    last,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'ends with',
                },
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: last,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'e',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'ends with',
                },
            },
        ]);
        it('has proper types', () => {
            // @ts-expect-error: number cannot be the child of string[]
            assertWrap.endsWithout(
                [
                    'a',
                    'b',
                ],
                'a' as any as number,
            );

            assertWrap.endsWithout(
                [
                    3,
                    'a',
                    'b',
                ],
                3,
            );

            // @ts-expect-error: string parent must have a string child
            assertWrap.endsWithout('one', 'o' as any as number);

            assertWrap.endsWithout('one', 'o');
        });
    });
    describe('checkWrap', () => {
        itCases(checkWrap.endsWithout, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: undefined,
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: last,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'e',
                ],
                expect: undefined,
            },
        ]);
        it('has proper types', () => {
            assert.isNotUndefined(
                // @ts-expect-error: number cannot be the child of string[]
                checkWrap.endsWithout(
                    [
                        'b',
                        'a',
                    ],
                    'b' as any as number,
                ),
            );

            assert.isNotUndefined(
                checkWrap.endsWithout(
                    [
                        3,
                        'a',
                        'b',
                    ],
                    3,
                ),
            );

            // @ts-expect-error: string parent must have a string child
            assert.isNotUndefined(checkWrap.endsWithout('one', 'o' as any as number));

            assert.isNotUndefined(checkWrap.endsWithout('one', 'o'));
        });
    });
    describe('waitUntil', () => {
        it('passes an array', async () => {
            const newValue = await waitUntil.endsWithout(
                first,
                () => {
                    return parentArray;
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.deepEquals(newValue, parentArray);
        });
        it('passes a string', async () => {
            const newValue = await waitUntil.endsWithout(
                'e',
                () => {
                    return last;
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.strictEquals(newValue, last);
            assert.isFalse(
                check.strictEquals(
                    newValue,
                    // @ts-expect-error: the value is more tightly typed than this
                    'e',
                ),
            );
        });
        it('has proper types', async () => {
            // @ts-expect-error: number cannot be the child of string[]
            await waitUntil.endsWithout('b' as any as number, () => [
                'b',
                'a',
            ]);

            await waitUntil.endsWithout(3, () => [
                3,
                'a',
                'b',
            ]);

            // @ts-expect-error: string parent must have a string child
            await waitUntil.endsWithout('o' as any as number, () => 'one');

            await waitUntil.endsWithout('o', () => 'one');
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.endsWithout(
                    last,
                    () => {
                        return parentArray;
                    },
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});

describe('startsWith', () => {
    const first = 'one';
    const last = 'eco';
    const parentArray = [
        first,
        last,
    ];

    describe('assert', () => {
        itCases(assert.startsWith, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    first,
                ],
                throws: undefined,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    last,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not start with',
                },
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                throws: undefined,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'e',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not start with',
                },
            },
        ]);
        it('has proper types', () => {
            // @ts-expect-error: number cannot be the child of string[]
            assert.startsWith(
                [
                    'a',
                    'b',
                ],
                'a' as any as number,
            );
            assert.startsWith(
                [
                    3,
                    'a',
                    'b',
                ],
                3,
            );
            // @ts-expect-error: string parent must have a string child
            assert.startsWith('one', 'o' as any as number);
            assert.startsWith('one', 'o');
        });
    });
    describe('check', () => {
        itCases(check.startsWith, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: true,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: false,
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: true,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'e',
                ],
                expect: false,
            },
        ]);
        it('has proper types', () => {
            assert.isTrue(
                // @ts-expect-error: number cannot be the child of string[]
                check.startsWith(
                    [
                        'a',
                        'b',
                    ],
                    'a' as any as number,
                ),
            );
            assert.isTrue(
                check.startsWith(
                    [
                        3,
                        'a',
                        'b',
                    ],
                    3,
                ),
            );
            assert.isTrue(
                // @ts-expect-error: string parent must have a string child
                check.startsWith('one', 'o' as any as number),
            );
            assert.isTrue(check.startsWith('one', 'o'));
        });
    });
    describe('assertWrap', () => {
        itCases(assertWrap.startsWith, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    last,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not start with',
                },
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: last,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'e',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'does not start with',
                },
            },
        ]);
        it('has proper types', () => {
            // @ts-expect-error: number cannot be the child of string[]
            assertWrap.startsWith(
                [
                    'a',
                    'b',
                ],
                'a' as any as number,
            );

            assertWrap.startsWith(
                [
                    3,
                    'a',
                    'b',
                ],
                3,
            );

            // @ts-expect-error: string parent must have a string child
            assertWrap.startsWith('one', 'o' as any as number);

            assertWrap.startsWith('one', 'o');
        });
    });
    describe('checkWrap', () => {
        itCases(checkWrap.startsWith, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: undefined,
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: last,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'e',
                ],
                expect: undefined,
            },
        ]);
        it('has proper types', () => {
            assert.isNotUndefined(
                // @ts-expect-error: number cannot be the child of string[]
                checkWrap.startsWith(
                    [
                        'a',
                        'b',
                    ],
                    'a' as any as number,
                ),
            );

            assert.isNotUndefined(
                checkWrap.startsWith(
                    [
                        3,
                        'a',
                        'b',
                    ],
                    3,
                ),
            );

            // @ts-expect-error: string parent must have a string child
            assert.isNotUndefined(checkWrap.startsWith('one', 'o' as any as number));

            assert.isNotUndefined(checkWrap.startsWith('one', 'o'));
        });
    });
    describe('waitUntil', () => {
        it('passes an array', async () => {
            const newValue = await waitUntil.startsWith(
                first,
                () => {
                    return parentArray;
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.deepEquals(newValue, parentArray);
        });
        it('passes a string', async () => {
            const newValue = await waitUntil.startsWith(
                'e',
                () => {
                    return last;
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.strictEquals(newValue, last);
            assert.isFalse(
                check.strictEquals(
                    newValue,
                    // @ts-expect-error: the value is more tightly typed than this
                    'e',
                ),
            );
        });
        it('has proper types', async () => {
            // @ts-expect-error: number cannot be the child of string[]
            await waitUntil.startsWith('a' as any as number, () => [
                'a',
                'b',
            ]);

            await waitUntil.startsWith(3, () => [
                3,
                'a',
                'b',
            ]);

            // @ts-expect-error: string parent must have a string child
            await waitUntil.startsWith('o' as any as number, () => 'one');

            await waitUntil.startsWith('o', () => 'one');
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.startsWith(
                    last,
                    () => {
                        return [];
                    },
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
describe('startsWithout', () => {
    const first = 'one';
    const last = 'two';
    const parentArray = [
        first,
        last,
    ];

    describe('assert', () => {
        itCases(assert.startsWithout, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    last,
                ],
                throws: undefined,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    first,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'starts with',
                },
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                throws: undefined,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'o',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'starts with',
                },
            },
        ]);
        it('has proper types', () => {
            // @ts-expect-error: number cannot be the child of string[]
            assert.startsWithout(
                [
                    'a',
                    'b',
                ],
                'b' as any as number,
            );
            assert.startsWithout(
                [
                    'a',
                    'b',
                    3,
                ],
                3,
            );
            // @ts-expect-error: string parent must have a string child
            assert.startsWithout('one', 'e' as any as number);
            assert.startsWithout('one', 'e');
        });
    });
    describe('check', () => {
        itCases(check.startsWithout, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: true,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: false,
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: true,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'o',
                ],
                expect: false,
            },
        ]);
        it('has proper types', () => {
            assert.isTrue(
                // @ts-expect-error: number cannot be the child of string[]
                check.startsWithout(
                    [
                        'a',
                        'b',
                    ],
                    'b' as any as number,
                ),
            );
            assert.isTrue(
                check.startsWithout(
                    [
                        'a',
                        'b',
                        3,
                    ],
                    3,
                ),
            );
            assert.isTrue(
                // @ts-expect-error: string parent must have a string child
                check.startsWithout('one', 'e' as any as number),
            );
            assert.isTrue(check.startsWithout('one', 'e'));
        });
    });
    describe('assertWrap', () => {
        itCases(assertWrap.startsWithout, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    first,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'starts with',
                },
            },
            {
                it: 'passes a string',
                inputs: [
                    last,
                    'e',
                ],
                expect: last,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'o',
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'starts with',
                },
            },
        ]);
        it('has proper types', () => {
            // @ts-expect-error: number cannot be the child of string[]
            assertWrap.startsWithout(
                [
                    'a',
                    'b',
                ],
                'b' as any as number,
            );

            assertWrap.startsWithout(
                [
                    'a',
                    'b',
                    3,
                ],
                3,
            );

            // @ts-expect-error: string parent must have a string child
            assertWrap.startsWithout('one', 'e' as any as number);

            assertWrap.startsWithout('one', 'e');
        });
    });
    describe('checkWrap', () => {
        itCases(checkWrap.startsWithout, [
            {
                it: 'passes an array',
                inputs: [
                    parentArray,
                    last,
                ],
                expect: parentArray,
            },
            {
                it: 'rejects an array',
                inputs: [
                    parentArray,
                    first,
                ],
                expect: undefined,
            },
            {
                it: 'passes a string',
                inputs: [
                    first,
                    'e',
                ],
                expect: first,
            },
            {
                it: 'rejects a string',
                inputs: [
                    first,
                    'o',
                ],
                expect: undefined,
            },
        ]);
        it('has proper types', () => {
            assert.isNotUndefined(
                // @ts-expect-error: number cannot be the child of string[]
                checkWrap.startsWithout(
                    [
                        'a',
                        'b',
                    ],
                    'b' as any as number,
                ),
            );

            assert.isNotUndefined(
                checkWrap.startsWithout(
                    [
                        'a',
                        'b',
                        3,
                    ],
                    3,
                ),
            );

            // @ts-expect-error: string parent must have a string child
            assert.isNotUndefined(checkWrap.startsWithout('one', 'e' as any as number));

            assert.isNotUndefined(checkWrap.startsWithout('one', 'e'));
        });
    });
    describe('waitUntil', () => {
        it('passes an array', async () => {
            const newValue = await waitUntil.startsWithout(
                last,
                () => {
                    return parentArray;
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.deepEquals(newValue, parentArray);
        });
        it('passes a string', async () => {
            const newValue = await waitUntil.startsWithout(
                'e',
                () => {
                    return last;
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.strictEquals(newValue, last);
            assert.isFalse(
                check.strictEquals(
                    newValue,
                    // @ts-expect-error: the value is more tightly typed than this
                    'e',
                ),
            );
        });
        it('has proper types', async () => {
            // @ts-expect-error: number cannot be the child of string[]
            await waitUntil.startsWithout('b' as any as number, () => [
                'a',
                'b',
            ]);

            await waitUntil.startsWithout(3, () => [
                'a',
                'b',
                3,
            ]);

            // @ts-expect-error: string parent must have a string child
            await waitUntil.startsWithout('e' as any as number, () => 'one');

            await waitUntil.startsWithout('e', () => 'one');
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.startsWithout(
                    first,
                    () => {
                        return parentArray;
                    },
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
