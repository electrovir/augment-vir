import {clamp, truncateNumber} from '@augment-vir/common';
import {expect} from 'chai';
import {describe, it} from 'mocha';

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

describe(truncateNumber.name, () => {
    it('should correctly truncate', () => {
        const comparisons: {value: number; truncated: string}[] = [
            {
                value: 1000,
                truncated: '1k',
            },
            {
                value: 1234,
                truncated: '1.234k',
            },
            {
                value: 12_344_567,
                truncated: '12.34M',
            },
            {
                value: 122_344_567,
                truncated: '122.3M',
            },
            {
                value: 123,
                truncated: '123',
            },
            {
                value: 1.567891,
                truncated: '1.5678',
            },
        ];

        expect(comparisons.length).to.be.greaterThan(0);

        comparisons.forEach((comparison) => {
            const truncated = truncateNumber(comparison.value);
            expect(truncated).to.equal(comparison.truncated);
            expect(truncated.length).to.be.lessThanOrEqual(6);
        });
    });

    it('should correctly truncate with custom suffixes', () => {
        const customSuffixes = [
            'A',
            'B',
            'C',
            'D',
            'E',
        ] as const;

        const comparisons: {value: number; truncated: string}[] = [
            {
                value: 1000,
                truncated: `1${customSuffixes[1]}`,
            },
            {
                value: 1234,
                truncated: `1.234${customSuffixes[1]}`,
            },
            {
                value: 12_344_567,
                truncated: `12.34${customSuffixes[2]}`,
            },
            {
                value: 122_344_567,
                truncated: `122.3${customSuffixes[2]}`,
            },
            {
                value: 123,
                truncated: `123${customSuffixes[0]}`,
            },
            {
                value: 1.567891,
                truncated: `1.567${customSuffixes[0]}`,
            },
        ];

        expect(comparisons.length).to.be.greaterThan(0);

        comparisons.forEach((comparison) => {
            const truncated = truncateNumber(comparison.value, customSuffixes);
            expect(truncated).to.equal(comparison.truncated);
            expect(truncated.length).to.be.lessThanOrEqual(6);
        });
    });
});
