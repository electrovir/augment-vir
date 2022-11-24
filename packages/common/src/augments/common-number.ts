import {removeCommasFromNumberString, typedSplit} from './common-string';
import {safeMatch} from './regexp';

export function addCommasToNumber(input: number): string {
    const stringValue: string = String(input);
    const [
        digits,
        decimalValues,
    ] = stringValue.split('.');
    const decimalString = decimalValues ? `.${decimalValues}` : '';

    const separated = safeMatch(digits!.split('').reverse().join(''), /.{1,3}/g)
        .reverse()
        .map((entry) => entry.split('').reverse().join(''));

    const withCommas = separated.join(',');

    return `${withCommas}${decimalString}`;
}

export function clamp(
    /**
     * This uses a destructured object so that consumers cannot get confused as to which input is
     * which (which would be easy to do since they're all of the same type).
     */
    {
        value,
        min,
        max,
    }: {
        value: number;
        min: number;
        max: number;
    },
): number {
    return Math.max(Math.min(value, max), min);
}

const defaultTruncationSuffixes = [
    '', // no suffix, numbers below 1000
    'k', // thousand
    'M', // million
    'B', // billion
    'T', // trillion
    'P', // peta-, quadrillion
    'E', // exa- quintillion
    'Z', // zetta- sextillion
    'Y', // yotta- septillion
] as const;

function recursiveTruncation(
    value: string,
    recursionDepth = 0,
    decimalValues = '',
): {
    value: string;
    recursionDepth: number;
    decimalValues: string;
} {
    if (value.includes('e+')) {
        throw new Error(`Number is too large, it cannot be truncated: ${value}`);
    } else if (value.includes('e-')) {
        throw new Error(`Number is too small, it cannot be truncated: ${value}`);
    }
    const split = typedSplit(value, '.');
    decimalValues = split[1] ?? decimalValues;
    const amount: string = split[0];
    if (amount.length > 3) {
        decimalValues = amount.slice(-3);
        return recursiveTruncation(amount.slice(0, -3), recursionDepth + 1, decimalValues);
    }

    return {
        value: amount,
        decimalValues,
        recursionDepth,
    };
}

const maxDecimals = 4;

/**
 * This truncates a number such that is will at a max have 6 characters including suffix, decimal
 * point, or comma.
 *
 * Default suffixes are:
 *
 *     '', // no suffix, numbers below 1000
 *     'k', // thousand
 *     'M', // million
 *     'B', // billion
 *     'T', // trillion
 *     'P', // peta-, quadrillion
 *     'E', // exa- quintillion
 *     'Z', // zetta- sextillion
 *     'Y', // yotta- septillion
 */
export function truncateNumber(
    originalValue: unknown,
    {
        customSuffixes,
        suppressErrorLogging,
        customErrorLogCallback,
    }: {
        customSuffixes?: ReadonlyArray<string>;
        suppressErrorLogging?: boolean;
        customErrorLogCallback?: (...args: any) => void;
    } = {},
): string {
    try {
        const value =
            typeof originalValue === 'number'
                ? originalValue
                : typeof originalValue === 'string'
                ? Number(removeCommasFromNumberString(originalValue))
                : Number(originalValue);

        if (isNaN(value)) {
            throw new Error(`${originalValue} could not be converted into a number.`);
        }

        const stringValue = String(value);

        const results = recursiveTruncation(stringValue);

        const suffixes = customSuffixes ?? defaultTruncationSuffixes;
        const suffix = suffixes[results.recursionDepth];

        if (suffix === undefined) {
            throw new Error(`Number is too large, could not truncate: ${value}`);
        }

        const decimalPlaces = maxDecimals - (results.value.length - 1) - suffix.length;

        const decimalValues = results.decimalValues.replace(/0+$/, '').slice(0, decimalPlaces);
        const withDecimal = decimalValues.length ? `.${decimalValues}` : '';

        const combined = `${results.value}${withDecimal}${suffix}`;

        if (combined.length > stringValue.length + 1) {
            return addCommasToNumber(value);
        } else {
            return combined;
        }
    } catch (error) {
        const errorCallback = customErrorLogCallback ? customErrorLogCallback : console.error;
        if (!suppressErrorLogging) {
            errorCallback(error);
        }
        return String(originalValue);
    }
}
