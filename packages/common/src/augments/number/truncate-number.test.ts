import {describe, itCases} from '@augment-vir/test';
import {truncateNumber} from './truncate-number.js';

describe(truncateNumber.name, () => {
    const testCases: ReadonlyArray<{
        in: number;
        out: string;
        maxLength?: number;
        customSuffixes?: ReadonlyArray<string>;
    }> = [
        {
            in: 1000,
            out: '1,000',
        },
        {
            in: 99_000,
            out: '99,000',
        },
        {
            in: 897_000.012,
            out: '897k',
        },
        {
            in: 99_000.123_45,
            out: '99,000',
        },
        {
            in: 0.05,
            out: '0.05',
        },
        {
            in: 1_000_000,
            out: '1M',
        },
        {
            in: 123.45,
            out: '123.45',
        },
        {
            in: 123.45,
            out: '123',
            maxLength: 3,
        },
        {
            in: 123_456_789,
            out: '123.4M',
        },
        {
            in: 'clearly not a number' as any,
            out: 'NaN',
        },
        {
            in: 123_456_789,
            out: '0.1B',
            maxLength: 3,
        },
        {
            in: 111_456_789,
            out: '0.1C',
            maxLength: 3,
            customSuffixes: [
                'A',
                'B',
                'C',
            ],
        },
        {
            in: 12_345_678,
            out: '12.3M',
            maxLength: 5,
        },
        {
            // eslint-disable-next-line no-loss-of-precision
            in: 999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999,
            out: '1e+81',
            maxLength: 5,
        },
        {
            in: 0.000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_1,
            out: '0',
            maxLength: 3,
        },
        {
            in: 0,
            out: '0',
        },
        {
            in: 0.000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_009,
            out: '9e-48',
        },
        {
            // eslint-disable-next-line no-loss-of-precision
            in: 999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999_999,
            out: 'Infinity',
            maxLength: 5,
        },
    ];

    const itCasesInput: ReadonlyArray<
        Readonly<{
            it: string;
            inputs: Parameters<typeof truncateNumber>;
            expect: string;
        }>
    > = testCases.map((testCase) => {
        const options =
            testCase.maxLength != undefined || testCase.customSuffixes
                ? {
                      maxLength: testCase.maxLength,
                      customSuffixes: testCase.customSuffixes,
                  }
                : undefined;
        const inputs: Parameters<typeof truncateNumber> = [
            testCase.in,
            options,
        ];

        return {
            it: `should convert ${testCase.in} to ${testCase.out}`,
            inputs,
            expect: testCase.out,
        };
    });

    itCases(truncateNumber, itCasesInput);
});
