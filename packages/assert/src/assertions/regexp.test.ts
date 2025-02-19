import {describe, it, itCases} from '@augment-vir/test';
import {AssertionError} from '../augments/assertion.error.js';
import {assertWrap} from '../augments/guards/assert-wrap.js';
import {assert} from '../augments/guards/assert.js';
import {checkWrap} from '../augments/guards/check-wrap.js';
import {check} from '../augments/guards/check.js';
import {waitUntil} from '../augments/guards/wait-until.js';
import {waitUntilTestOptions} from '../test-timeout.mock.js';

describe('matches', () => {
    const valuePass = 'abcdefg';
    const regexp = /abc/;
    const valueFail = 'a b c';

    describe('assert', () => {
        itCases(assert.matches, [
            {
                it: 'passes',
                inputs: [
                    valuePass,
                    regexp,
                ],
                throws: undefined,
            },
            {
                it: 'rejects',
                inputs: [
                    valueFail,
                    regexp,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: "'a b c' does not match /abc/",
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.matches, [
            {
                it: 'passes',
                inputs: [
                    valuePass,
                    regexp,
                ],
                expect: true,
            },
            {
                it: 'rejects',
                inputs: [
                    valueFail,
                    regexp,
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.matches, [
            {
                it: 'passes',
                inputs: [
                    valuePass,
                    regexp,
                ],
                expect: valuePass,
            },
            {
                it: 'rejects',
                inputs: [
                    valueFail,
                    regexp,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: "'a b c' does not match /abc/",
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.matches, [
            {
                it: 'passes',
                inputs: [
                    valuePass,
                    regexp,
                ],
                expect: valuePass,
            },
            {
                it: 'rejects',
                inputs: [
                    valueFail,
                    regexp,
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let counter = 0;
            const newValue = await waitUntil.matches(
                regexp,
                () => {
                    ++counter;
                    if (counter > 2) {
                        return valuePass;
                    } else {
                        return valueFail;
                    }
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.deepEquals(newValue, valuePass);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.matches(
                    regexp,
                    () => {
                        return valueFail;
                    },
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
describe('mismatches', () => {
    const valuePass = 'a b c';
    const regexp = /abc/;
    const valueFail = 'abcdefg';

    describe('assert', () => {
        itCases(assert.mismatches, [
            {
                it: 'rejects',
                inputs: [
                    valuePass,
                    regexp,
                ],
                throws: undefined,
            },
            {
                it: 'rejects',
                inputs: [
                    valueFail,
                    regexp,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'matches',
                },
            },
        ]);
    });
    describe('check', () => {
        itCases(check.mismatches, [
            {
                it: 'passes',
                inputs: [
                    valuePass,
                    regexp,
                ],
                expect: true,
            },
            {
                it: 'rejects',
                inputs: [
                    valueFail,
                    regexp,
                ],
                expect: false,
            },
        ]);
    });
    describe('assertWrap', () => {
        itCases(assertWrap.mismatches, [
            {
                it: 'passes',
                inputs: [
                    valuePass,
                    regexp,
                ],
                expect: valuePass,
            },
            {
                it: 'rejects',
                inputs: [
                    valueFail,
                    regexp,
                ],
                throws: {
                    matchConstructor: AssertionError,
                    matchMessage: 'matches',
                },
            },
        ]);
    });
    describe('checkWrap', () => {
        itCases(checkWrap.mismatches, [
            {
                it: 'passes',
                inputs: [
                    valuePass,
                    regexp,
                ],
                expect: valuePass,
            },
            {
                it: 'rejects',
                inputs: [
                    valueFail,
                    regexp,
                ],
                expect: undefined,
            },
        ]);
    });
    describe('waitUntil', () => {
        it('passes', async () => {
            let counter = 0;
            const newValue = await waitUntil.mismatches(
                regexp,
                () => {
                    ++counter;
                    if (counter > 2) {
                        return valuePass;
                    } else {
                        return valueFail;
                    }
                },
                waitUntilTestOptions,
                'failure',
            );
            assert.deepEquals(newValue, valuePass);
        });
        it('rejects', async () => {
            await assert.throws(
                waitUntil.mismatches(
                    regexp,
                    () => {
                        return valueFail;
                    },
                    waitUntilTestOptions,
                    'failure',
                ),
            );
        });
    });
});
