import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {wrapNumber} from './wrap-number.js';

describe(wrapNumber.name, () => {
    itCases(wrapNumber, [
        {
            it: 'wraps above max',
            inputs: [
                10,
                {
                    min: 0,
                    max: 5,
                },
            ],
            expect: 0,
        },
        {
            it: 'wraps below min',
            inputs: [
                1,
                {
                    min: 5,
                    max: 10,
                },
            ],
            expect: 10,
        },
        {
            it: 'ignores in-between values',
            inputs: [
                5,
                {
                    min: 0,
                    max: 10,
                },
            ],
            expect: 5,
        },
        {
            it: 'allows overflowing positive with min = 0',
            inputs: [
                13,
                {
                    min: 0,
                    max: 3,
                    takeOverflow: true,
                },
            ],
            expect: 1,
        },
        {
            it: 'allows overflowing negative with min = 0',
            inputs: [
                -7,
                {
                    min: 0,
                    max: 3,
                    takeOverflow: true,
                },
            ],
            expect: 1,
        },
        {
            it: 'allows overflowing positive with min > 0',
            inputs: [
                7,
                {
                    min: 2,
                    max: 5,
                    takeOverflow: true,
                },
            ],
            expect: 3,
        },
        {
            it: 'allows overflowing negative with min > 0',
            inputs: [
                -7,
                {
                    min: 2,
                    max: 5,
                    takeOverflow: true,
                },
            ],
            expect: 5,
        },
        {
            it: 'allows overflowing positive with min < 0',
            inputs: [
                7,
                {
                    min: -2,
                    max: 5,
                    takeOverflow: true,
                },
            ],
            expect: -1,
        },
        {
            it: 'allows overflowing negative with min < 0',
            inputs: [
                -10,
                {
                    min: -2,
                    max: 5,
                    takeOverflow: true,
                },
            ],
            expect: -2,
        },
        {
            it: 'ignores non wrapping value with overflow',
            inputs: [
                7,
                {
                    min: 0,
                    max: 10,
                    takeOverflow: true,
                },
            ],
            expect: 7,
        },
    ]);
    it('allows sequencing through all values', () => {
        const positiveWrapping: number[] = [];
        const positiveWrapNoOverflow: number[] = [];
        const negativeWrapping: number[] = [];
        const negativeWrapNoOverflow: number[] = [];

        for (let i = 0; i < 12; i++) {
            positiveWrapping.push(
                wrapNumber(i, {
                    min: 0,
                    max: 4,
                    takeOverflow: true,
                }),
            );
            positiveWrapNoOverflow.push(
                wrapNumber(i, {
                    min: 0,
                    max: 4,
                }),
            );
        }
        for (let i = 0; i > -12; i--) {
            negativeWrapping.push(
                wrapNumber(i, {
                    min: 0,
                    max: 4,
                    takeOverflow: true,
                }),
            );
            negativeWrapNoOverflow.push(
                wrapNumber(i, {
                    min: 0,
                    max: 4,
                }),
            );
        }

        assert.deepEquals(
            positiveWrapping,
            [
                0,
                1,
                2,
                3,
                4,
                0,
                1,
                2,
                3,
                4,
                0,
                1,
            ],
        );
        assert.deepEquals(
            positiveWrapNoOverflow,
            [
                0,
                1,
                2,
                3,
                4,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
            ],
        );
        assert.deepEquals(
            negativeWrapping,
            [
                0,
                4,
                3,
                2,
                1,
                0,
                4,
                3,
                2,
                1,
                0,
                4,
            ],
        );
        assert.deepEquals(
            negativeWrapNoOverflow,
            [
                0,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
            ],
        );
    });
});
