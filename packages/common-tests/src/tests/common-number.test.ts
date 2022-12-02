import {itCases} from '@augment-vir/testing';
import {assert, expect} from 'chai';
import {describe, it} from 'mocha';
import {addCommasToNumber, clamp, truncateNumber} from '../../../common/src/augments/common-number';

describe(clamp.name, () => {
    it('should successfully clamp downwards', () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 150,
            }),
        ).to.equal(45);
    });

    it('should successfully clamp upwards', () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 13,
            }),
        ).to.equal(31);
    });

    it("shouldn't change values in the middle", () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 42,
            }),
        ).to.equal(42);
    });
});

describe(addCommasToNumber.name, () => {
    itCases(assert, addCommasToNumber, [
        {
            it: 'should add a comma to a thousand',
            input: 1_000,
            expect: '1,000',
        },
        {
            it: 'should add multiple commas',
            input: 1_000_123_123,
            expect: '1,000,123,123',
        },
        {
            it: 'should add commas even when there are decimal points',
            input: 1_000_123.456,
            expect: '1,000,123.456',
        },
    ]);
});

describe(truncateNumber.name, () => {
    const customSuffixes = [
        'A',
        'B',
        'C',
        'D',
        'E',
    ] as const;

    itCases(assert, truncateNumber, [
        {
            it: 'should truncate to 1k',
            inputs: [1000],
            expect: '1k',
        },
        {
            it: 'should not truncate with a purely decimal number',
            inputs: [0.05],
            expect: '0.05',
        },
        {
            it: 'should not truncate on huge number',
            inputs: [
                9999999999999999999999999,
                {
                    suppressErrorLogging: true,
                },
            ],
            expect: '1e+25',
        },
        {
            it: 'should not truncate on tiny number',
            inputs: [
                0.000000000000000006,
                {
                    suppressErrorLogging: true,
                },
            ],
            expect: '6e-18',
        },
        {
            it: 'should error on invalid input',
            inputs: [
                'hello there',
                {
                    suppressErrorLogging: true,
                },
            ],
            expect: 'hello there',
        },
        {
            it: 'should error if custom suffixes are not long enough',
            inputs: [
                1_000_000_000,
                {
                    customSuffixes: [
                        '',
                        'a',
                    ],
                    suppressErrorLogging: true,
                },
            ],
            expect: '1000000000',
        },
        {
            it: 'should just add a comma to a thousand',
            inputs: [1234],
            expect: '1,234',
        },
        {
            it: 'should truncate two digit million',
            inputs: [12_344_567],
            expect: '12.34M',
        },
        {
            it: 'should truncate three digit million',
            inputs: [122_344_567],
            expect: '122.3M',
        },
        {
            it: 'should not make any change to short numbers',
            inputs: [123],
            expect: '123',
        },
        {
            it: 'should truncate decimals',
            inputs: [1.567891],
            expect: '1.5678',
        },

        {
            it: 'should truncate one thousand with custom suffixes',
            inputs: [
                1000,
                {customSuffixes},
            ],
            expect: `1${customSuffixes[1]}`,
        },
        {
            it: 'should still just add a comma to a thousand',
            inputs: [
                1234,
                {customSuffixes},
            ],
            expect: `1,234`,
        },
        {
            it: 'should truncate two digit million with custom suffixes',
            inputs: [
                12_344_567,
                {customSuffixes},
            ],
            expect: `12.34${customSuffixes[2]}`,
        },
        {
            it: 'should truncate three digit million with custom suffixes',
            inputs: [
                122_344_567,
                {customSuffixes},
            ],
            expect: `122.3${customSuffixes[2]}`,
        },
        {
            it: 'should truncate short numbers with custom suffixes',
            inputs: [
                123,
                {customSuffixes},
            ],
            expect: `123${customSuffixes[0]}`,
        },
        {
            it: 'should truncate decimal with custom suffixes',
            inputs: [
                1.567891,
                {customSuffixes},
            ],
            expect: `1.567${customSuffixes[0]}`,
        },
        {
            it: 'should return a string for a non-string and non-number input',
            inputs: [
                {},
                {
                    suppressErrorLogging: true,
                },
            ],
            expect: '[object Object]',
        },
    ]);

    it('should log an error when one occurs', () => {
        const errorOutput: unknown[] = [];
        truncateNumber('not a number', {
            customErrorLogCallback: (...args) => {
                errorOutput.push(args);
            },
        });
        assert.lengthOf(errorOutput, 1);
        assert.isArray(errorOutput[0]);
        assert.instanceOf((errorOutput[0] as unknown[])[0], Error);
    });
});
