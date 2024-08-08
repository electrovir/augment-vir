import {safeMatch} from '../regexp/safe-match.js';

/**
 * Removes all commas from the given string.
 *
 * @category String:Common
 */
export function removeCommas(input: string): string {
    return input.replace(/,/g, '');
}

export function addCommasToNumber(input: number | string): string {
    if (typeof input === 'string' && isNaN(Number(input))) {
        return 'NaN';
    }
    const numericValue: number = Number(input);
    const isNegative: boolean = numericValue < 0;

    const stringValue: string = String(Math.abs(numericValue));
    const [
        digits = '',
        decimalValues,
    ] = stringValue.split('.');
    const decimalString = decimalValues ? `.${decimalValues}` : '';

    const separated = safeMatch(digits.split('').reverse().join(''), /.{1,3}/g)
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
