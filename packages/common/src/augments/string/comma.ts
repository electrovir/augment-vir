import {safeMatch} from '../regexp/match.js';

/**
 * Removes all commas from the given string.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export function removeCommas(input: string): string {
    return input.replace(/,/g, '');
}

/**
 * Convert the given number into a string, then add commas like a normal number would have.
 *
 * @category String
 * @category Number
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {addCommasToNumber} from '@augment-vir/common';
 *
 * addCommasToNumber(1000123.456);
 * // output is `'1,000,123.456'`
 * ```
 *
 * @package @augment-vir/common
 */
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
