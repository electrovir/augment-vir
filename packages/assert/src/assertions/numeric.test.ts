import {describe, it, itCases} from '@augment-vir/test';
import {AssertionError} from '../augments/assertion.error.js';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('isAbove', () => {
    describe('assert', () => {
        itCases(assert.isAbove, [
            {
                it: 'passes',
                inputs: [
                    50,
                    30,
                ],
                throws: undefined,
            },
            {
                it: 'rejects identical',
                inputs: [
                    30,
                    30,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not above 30',
                },
            },
            {
                it: 'rejects',
                inputs: [
                    30,
                    50,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not above 50',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isAbove, [
            {
                it: 'passes',
                inputs: [
                    50,
                    30,
                ],
                expect: true,
            },
            {
                it: 'rejects identical',
                inputs: [
                    30,
                    30,
                ],
                expect: false,
            },
            {
                it: 'rejects',
                inputs: [
                    30,
                    50,
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isAbove, [
            {
                it: 'passes',
                inputs: [
                    50,
                    30,
                ],
                expect: 50,
            },
            {
                it: 'rejects identical',
                inputs: [
                    30,
                    30,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not above 30',
                },
            },
            {
                it: 'rejects',
                inputs: [
                    30,
                    50,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not above 50',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isAbove, [
            {
                it: 'passes',
                inputs: [
                    50,
                    30,
                ],
                expect: 50,
            },
            {
                it: 'rejects identical',
                inputs: [
                    30,
                    30,
                ],
                expect: undefined,
            },
            {
                it: 'rejects',
                inputs: [
                    30,
                    50,
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 0;
            const result = await waitUntil.isAbove(
                3,
                () => {
                    return ++value;
                },
                waitUntilTestOptions,
            );
            assert.strictEquals(result, 4);
        });
        it('rejects identical', async () => {
            const value = 3;
            await assert.throws(() =>
                waitUntil.isAbove(
                    3,
                    () => {
                        return value;
                    },
                    waitUntilTestOptions,
                ),
            );
        });
        it('rejects', async () => {
            const value = 0;
            await assert.throws(() =>
                waitUntil.isAbove(
                    3,
                    () => {
                        return value;
                    },
                    waitUntilTestOptions,
                ),
            );
        });
    });
});

describe('isAtLeast', () => {
    describe('assert', () => {
        itCases(assert.isAtLeast, [
            {
                it: 'passes',
                inputs: [
                    50,
                    30,
                ],
                throws: undefined,
            },
            {
                it: 'passes identical',
                inputs: [
                    30,
                    30,
                ],
                throws: undefined,
            },
            {
                it: 'rejects',
                inputs: [
                    30,
                    50,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not at least 50',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isAtLeast, [
            {
                it: 'passes',
                inputs: [
                    50,
                    30,
                ],
                expect: true,
            },
            {
                it: 'passes identical',
                inputs: [
                    30,
                    30,
                ],
                expect: true,
            },
            {
                it: 'rejects',
                inputs: [
                    30,
                    50,
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isAtLeast, [
            {
                it: 'passes',
                inputs: [
                    50,
                    30,
                ],
                expect: 50,
            },
            {
                it: 'passes identical',
                inputs: [
                    30,
                    30,
                ],
                expect: 30,
            },
            {
                it: 'rejects',
                inputs: [
                    30,
                    50,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not at least 50',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isAtLeast, [
            {
                it: 'passes',
                inputs: [
                    50,
                    30,
                ],
                expect: 50,
            },
            {
                it: 'passes identical',
                inputs: [
                    30,
                    30,
                ],
                expect: 30,
            },
            {
                it: 'rejects',
                inputs: [
                    30,
                    50,
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 0;
            const result = await waitUntil.isAtLeast(
                3,
                () => {
                    return ++value;
                },
                waitUntilTestOptions,
            );
            assert.strictEquals(result, 3);
        });
        it('passes identical', async () => {
            let value = 2;
            const result = await waitUntil.isAtLeast(
                3,
                () => {
                    return ++value;
                },
                waitUntilTestOptions,
            );
            assert.strictEquals(result, 3);
        });
        it('rejects', async () => {
            const value = 0;
            await assert.throws(() =>
                waitUntil.isAtLeast(
                    3,
                    () => {
                        return value;
                    },
                    waitUntilTestOptions,
                ),
            );
        });
    });
});

describe('isBelow', () => {
    describe('assert', () => {
        itCases(assert.isBelow, [
            {
                it: 'passes',
                inputs: [
                    30,
                    50,
                ],
                throws: undefined,
            },
            {
                it: 'rejects identical',
                inputs: [
                    30,
                    30,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not below 30',
                },
            },
            {
                it: 'rejects',
                inputs: [
                    50,
                    30,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '50 is not below 30',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isBelow, [
            {
                it: 'passes',
                inputs: [
                    30,
                    50,
                ],
                expect: true,
            },
            {
                it: 'rejects identical',
                inputs: [
                    30,
                    30,
                ],
                expect: false,
            },
            {
                it: 'rejects',
                inputs: [
                    50,
                    30,
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isBelow, [
            {
                it: 'passes',
                inputs: [
                    30,
                    50,
                ],
                expect: 30,
            },
            {
                it: 'rejects identical',
                inputs: [
                    30,
                    30,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not below 30',
                },
            },
            {
                it: 'rejects',
                inputs: [
                    50,
                    30,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '50 is not below 30',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isBelow, [
            {
                it: 'passes',
                inputs: [
                    30,
                    50,
                ],
                expect: 30,
            },
            {
                it: 'fails identical',
                inputs: [
                    30,
                    30,
                ],
                expect: undefined,
            },
            {
                it: 'rejects',
                inputs: [
                    50,
                    30,
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 6;
            const result = await waitUntil.isBelow(
                3,
                () => {
                    return --value;
                },
                waitUntilTestOptions,
            );
            assert.strictEquals(result, 2);
        });
        it('rejects identical', async () => {
            const value = 3;
            await assert.throws(() =>
                waitUntil.isBelow(
                    3,
                    () => {
                        return value;
                    },
                    waitUntilTestOptions,
                ),
            );
        });
        it('rejects', async () => {
            const value = 6;
            await assert.throws(() =>
                waitUntil.isBelow(
                    3,
                    () => {
                        return value;
                    },
                    waitUntilTestOptions,
                ),
            );
        });
    });
});

describe('isAtMost', () => {
    describe('assert', () => {
        itCases(assert.isAtMost, [
            {
                it: 'passes',
                inputs: [
                    30,
                    50,
                ],
                throws: undefined,
            },
            {
                it: 'passes identical',
                inputs: [
                    30,
                    30,
                ],
                throws: undefined,
            },
            {
                it: 'rejects',
                inputs: [
                    50,
                    30,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '50 is not at most 30',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isAtMost, [
            {
                it: 'passes',
                inputs: [
                    30,
                    50,
                ],
                expect: true,
            },
            {
                it: 'passes identical',
                inputs: [
                    30,
                    30,
                ],
                expect: true,
            },
            {
                it: 'rejects',
                inputs: [
                    50,
                    30,
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isAtMost, [
            {
                it: 'passes',
                inputs: [
                    30,
                    50,
                ],
                expect: 30,
            },
            {
                it: 'passes identical',
                inputs: [
                    30,
                    30,
                ],
                expect: 30,
            },
            {
                it: 'rejects',
                inputs: [
                    50,
                    30,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '50 is not at most 30',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isAtMost, [
            {
                it: 'passes',
                inputs: [
                    30,
                    50,
                ],
                expect: 30,
            },
            {
                it: 'passes identical',
                inputs: [
                    30,
                    30,
                ],
                expect: 30,
            },
            {
                it: 'rejects',
                inputs: [
                    50,
                    30,
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 6;
            const result = await waitUntil.isAtMost(
                3,
                () => {
                    return --value;
                },
                waitUntilTestOptions,
            );
            assert.strictEquals(result, 3);
        });
        it('passes identical', async () => {
            const value = 3;
            const result = await waitUntil.isAtMost(
                3,
                () => {
                    return value;
                },
                waitUntilTestOptions,
            );
            assert.strictEquals(result, 3);
        });
        it('rejects', async () => {
            const value = 6;
            await assert.throws(() =>
                waitUntil.isAtMost(
                    3,
                    () => {
                        return value;
                    },
                    waitUntilTestOptions,
                ),
            );
        });
    });
});

describe('isNaN', () => {
    describe('assert', () => {
        itCases(assert.isNaN, [
            {
                it: 'passes',
                inputs: [NaN],
                throws: undefined,
            },
            {
                it: 'rejects',
                inputs: [30],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not NaN',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isNaN, [
            {
                it: 'passes',
                input: NaN,
                expect: true,
            },
            {
                it: 'rejects',
                input: 30,
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isNaN, [
            {
                it: 'passes',
                inputs: [NaN],
                expect: NaN,
            },
            {
                it: 'rejects',
                inputs: [30],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '30 is not NaN',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isNaN, [
            {
                it: 'passes',
                inputs: [NaN],
                expect: NaN,
            },
            {
                it: 'rejects',
                inputs: [30],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 3;
            const result = await waitUntil.isNaN(() => {
                --value;
                // eslint-disable-next-line sonarjs/no-identical-expressions
                return value / value;
            }, waitUntilTestOptions);
            assert(isNaN(result));
        });
        it('rejects', async () => {
            const value = 0;
            await assert.throws(() =>
                waitUntil.isNaN(() => {
                    return value;
                }, waitUntilTestOptions),
            );
        });
    });
});

describe('isFinite', () => {
    describe('assert', () => {
        itCases(assert.isFinite, [
            {
                it: 'passes',
                inputs: [5],
                throws: undefined,
            },
            {
                it: 'rejects NaN',
                inputs: [NaN],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'NaN is not finite',
                },
            },
            {
                it: 'rejects Infinity',
                inputs: [Infinity],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'Infinity is not finite',
                },
            },
            {
                it: 'rejects -Infinity',
                inputs: [-Infinity],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '-Infinity is not finite',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isFinite, [
            {
                it: 'passes',
                input: 5,
                expect: true,
            },
            {
                it: 'rejects NaN',
                input: NaN,
                expect: false,
            },
            {
                it: 'rejects Infinity',
                input: Infinity,
                expect: false,
            },
            {
                it: 'rejects -Infinity',
                input: -Infinity,
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isFinite, [
            {
                it: 'passes',
                inputs: [5],
                expect: 5,
            },
            {
                it: 'rejects NaN',
                inputs: [NaN],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'NaN is not finite',
                },
            },
            {
                it: 'rejects Infinity',
                inputs: [Infinity],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'Infinity is not finite',
                },
            },
            {
                it: 'rejects -Infinity',
                inputs: [-Infinity],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '-Infinity is not finite',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isFinite, [
            {
                it: 'passes',
                inputs: [5],
                expect: 5,
            },
            {
                it: 'rejects NaN',
                inputs: [NaN],
                expect: undefined,
            },
            {
                it: 'rejects Infinity',
                inputs: [Infinity],
                expect: undefined,
            },
            {
                it: 'rejects -Infinity',
                inputs: [-Infinity],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 0;
            const result = await waitUntil.isFinite(() => {
                ++value;
                if (value < 3) {
                    return Infinity;
                } else {
                    return value;
                }
            }, waitUntilTestOptions);
            assert.strictEquals(result, 3);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isFinite(() => {
                    return Infinity;
                }, waitUntilTestOptions),
            );
        });
    });
});
describe('isInfinite', () => {
    describe('assert', () => {
        itCases(assert.isInfinite, [
            {
                it: 'rejects a number',
                inputs: [5],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '5 is not infinite',
                },
            },
            {
                it: 'rejects NaN',
                inputs: [NaN],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'NaN is not infinite',
                },
            },
            {
                it: 'accepts Infinity',
                inputs: [Infinity],
                throws: undefined,
            },
            {
                it: 'accepts -Infinity',
                inputs: [-Infinity],
                throws: undefined,
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isInfinite, [
            {
                it: 'rejects a number',
                input: 5,
                expect: false,
            },
            {
                it: 'rejects NaN',
                input: NaN,
                expect: false,
            },
            {
                it: 'accepts Infinity',
                input: Infinity,
                expect: true,
            },
            {
                it: 'accepts -Infinity',
                input: -Infinity,
                expect: true,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isInfinite, [
            {
                it: 'rejects a number',
                inputs: [5],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '5 is not infinite',
                },
            },
            {
                it: 'rejects NaN',
                inputs: [NaN],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'NaN is not infinite',
                },
            },
            {
                it: 'accepts Infinity',
                inputs: [Infinity],
                expect: Infinity,
            },
            {
                it: 'accepts -Infinity',
                inputs: [-Infinity],
                expect: -Infinity,
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isInfinite, [
            {
                it: 'rejects a number',
                inputs: [5],
                expect: undefined,
            },
            {
                it: 'rejects NaN',
                inputs: [NaN],
                expect: undefined,
            },
            {
                it: 'accepts Infinity',
                inputs: [Infinity],
                expect: Infinity,
            },
            {
                it: 'accepts -Infinity',
                inputs: [-Infinity],
                expect: -Infinity,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 0;
            const result = await waitUntil.isInfinite(() => {
                ++value;
                if (value > 3) {
                    return Infinity;
                } else {
                    return value;
                }
            }, waitUntilTestOptions);
            assert.strictEquals(result, Infinity);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.isInfinite(() => {
                    return 3;
                }, waitUntilTestOptions),
            );
        });
    });
});

describe('isApproximately', () => {
    describe('assert', () => {
        itCases(assert.isApproximately, [
            {
                it: 'passes within range',
                inputs: [
                    1,
                    5,
                    10,
                ],
                throws: undefined,
            },
            {
                it: 'rejects below range',
                inputs: [
                    1,
                    5,
                    1,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '1 is not within ±1 of 5',
                },
            },
            {
                it: 'rejects above range',
                inputs: [
                    10,
                    5,
                    1,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '10 is not within ±1 of 5',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isApproximately, [
            {
                it: 'passes within range',
                inputs: [
                    1,
                    5,
                    10,
                ],
                expect: true,
            },
            {
                it: 'rejects below range',
                inputs: [
                    1,
                    5,
                    1,
                ],
                expect: false,
            },
            {
                it: 'rejects above range',
                inputs: [
                    10,
                    5,
                    1,
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isApproximately, [
            {
                it: 'passes within range',
                inputs: [
                    1,
                    5,
                    10,
                ],
                expect: 1,
            },
            {
                it: 'rejects below range',
                inputs: [
                    1,
                    5,
                    1,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '1 is not within ±1 of 5',
                },
            },
            {
                it: 'rejects above range',
                inputs: [
                    10,
                    5,
                    1,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '10 is not within ±1 of 5',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isApproximately, [
            {
                it: 'passes within range',
                inputs: [
                    1,
                    5,
                    10,
                ],
                expect: 1,
            },
            {
                it: 'rejects below range',
                inputs: [
                    1,
                    5,
                    1,
                ],
                expect: undefined,
            },
            {
                it: 'rejects above range',
                inputs: [
                    10,
                    5,
                    1,
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 0;
            const result = await waitUntil.isApproximately(
                5,
                1,
                () => {
                    return ++value;
                },
                waitUntilTestOptions,
            );
            assert.strictEquals(result, 4);
        });
        it('rejects', async () => {
            const value = 0;
            await assert.throws(() =>
                waitUntil.isApproximately(
                    5,
                    1,
                    () => {
                        return value;
                    },
                    waitUntilTestOptions,
                ),
            );
        });
    });
});
describe('isNotApproximately', () => {
    describe('assert', () => {
        itCases(assert.isNotApproximately, [
            {
                it: 'rejects within range',
                inputs: [
                    1,
                    5,
                    10,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '1 is within ±10 of 5',
                },
            },
            {
                it: 'accepts below range',
                inputs: [
                    1,
                    5,
                    1,
                ],
                throws: undefined,
            },
            {
                it: 'accepts above range',
                inputs: [
                    10,
                    5,
                    1,
                ],
                throws: undefined,
            },
        ]);
    });
    describe('check', () => {
        itCases(check.isNotApproximately, [
            {
                it: 'rejects within range',
                inputs: [
                    1,
                    5,
                    10,
                ],
                expect: false,
            },
            {
                it: 'accepts below range',
                inputs: [
                    1,
                    5,
                    1,
                ],
                expect: true,
            },
            {
                it: 'accepts above range',
                inputs: [
                    10,
                    5,
                    1,
                ],
                expect: true,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.isNotApproximately, [
            {
                it: 'rejects within range',
                inputs: [
                    1,
                    5,
                    10,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: '1 is within ±10 of 5',
                },
            },
            {
                it: 'accepts below range',
                inputs: [
                    1,
                    5,
                    1,
                ],
                expect: 1,
            },
            {
                it: 'accepts above range',
                inputs: [
                    10,
                    5,
                    1,
                ],
                expect: 10,
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.isNotApproximately, [
            {
                it: 'rejects within range',
                inputs: [
                    1,
                    5,
                    10,
                ],
                expect: undefined,
            },
            {
                it: 'accepts below range',
                inputs: [
                    1,
                    5,
                    1,
                ],
                expect: 1,
            },
            {
                it: 'accepts above range',
                inputs: [
                    10,
                    5,
                    1,
                ],
                expect: 10,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let value = 5;
            const result = await waitUntil.isNotApproximately(
                5,
                1,
                () => {
                    return ++value;
                },
                waitUntilTestOptions,
            );
            assert.strictEquals(result, 7);
        });
        it('rejects', async () => {
            const value = 5;
            await assert.throws(() =>
                waitUntil.isNotApproximately(
                    5,
                    1,
                    () => {
                        return value;
                    },
                    waitUntilTestOptions,
                ),
            );
        });
    });
});
