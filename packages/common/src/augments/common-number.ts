import {removeCommasFromNumberString} from './common-string';
import {safeMatch} from './regexp';

export const NaNString = String(NaN);

export function addCommasToNumber(input: number | string): string {
    if (typeof input === 'string' && isNaN(Number(input))) {
        return NaNString;
    }
    const numericValue: number = Number(input);
    const isNegative: boolean = numericValue < 0;

    const stringValue: string = String(Math.abs(numericValue));
    const [
        digits,
        decimalValues,
    ] = stringValue.split('.');
    const decimalString = decimalValues ? `.${decimalValues}` : '';

    const separated = safeMatch(digits!.split('').reverse().join(''), /.{1,3}/g)
        .reverse()
        .map((entry) => entry.split('').reverse().join(''));

    const valueWithCommas = separated.join(',');

    const negativeMarker = isNegative ? '-' : '';

    return [
        negativeMarker,
        valueWithCommas,
        decimalString,
    ].join('');
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

/**
 * Tries to convert the input into a number. Handles strings with commas. Note: this might return
 * `NaN`.
 */
export function toNumber(input: unknown): number {
    if (typeof input === 'number') {
        return input;
    } else if (typeof input === 'string') {
        return Number(removeCommasFromNumberString(input));
    } else {
        return Number(input);
    }
}

/** @deprecated Use {@link toNumber} instead. */
export const convertIntoNumber = toNumber;

/** Tries to convert the input into a number and throws an error if `NaN` is created. */
export function toEnsuredNumber(input: unknown): number {
    const numeric = toMaybeNumber(input);

    if (numeric == undefined) {
        throw new Error(`Cannot convert to a number: ${input}`);
    } else {
        return numeric;
    }
}

/** Tries to convert the input into a number and returns `undefined` if `NaN` is created. */
export function toMaybeNumber(input: unknown): number | undefined {
    const numeric = toNumber(input);

    if (isNaN(numeric)) {
        return undefined;
    } else {
        return numeric;
    }
}
/**
 * If the given value is outside the given min/max bounds, instead of clamping the number (as the
 * `clamp` function does), this function wraps the value around to the next bound.
 *
 * @example
 *     wrapNumber({min: 0, max: 100, value: 101}) == 0;
 */
export function wrapNumber({max, min, value}: {value: number; max: number; min: number}): number {
    if (value > max) {
        return min;
    } else if (value < min) {
        return max;
    }

    return value;
}

export function round(inputs: {number: number; digits: number}): number {
    const digitFactor = Math.pow(10, inputs.digits);
    const multiplied = inputs.number * digitFactor;

    return Number((Math.round(multiplied) / digitFactor).toFixed(inputs.digits));
}

/** Clamp's the given value to within the min and max bounds, inclusive. */
export function clamp({value, min, max}: {value: number; min: number; max: number}) {
    return Math.min(Math.max(value, min), max);
}

/** Standard box dimensions. */
export type Dimensions = {width: number; height: number};
