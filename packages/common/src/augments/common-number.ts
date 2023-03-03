import {removeCommasFromNumberString} from './common-string';
import {safeMatch} from './regexp';

export const NaNString = String(NaN);

export function addCommasToNumber(input: number | string): string {
    if (typeof input === 'string' && isNaN(Number(input))) {
        return NaNString;
    }
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

export function convertIntoNumber(input: unknown): number {
    if (typeof input === 'number') {
        return input;
    } else if (typeof input === 'string') {
        return Number(removeCommasFromNumberString(input));
    } else {
        return Number(input);
    }
}

export function doesRequireScientificNotation(input: number): boolean {
    return String(input).includes('e');
}

/**
 * Given a min and max, ensures that they are in correct order. Meaning, min is less than max. If
 * that is not the case, the returned value is the given min and max values swapped.
 */
export function ensureMinAndMax({min, max}: {min: number; max: number}): {
    min: number;
    max: number;
} {
    if (min > max) {
        return {min: max, max: min};
    } else {
        return {min, max};
    }
}
