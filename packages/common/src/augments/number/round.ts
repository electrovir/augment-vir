/**
 * Round a value to the given number of decimal digits. If no decimal value is present, no rounding
 * occurs.
 *
 * @category Number : Common
 * @example
 *
 * ```ts
 * import {round} from '@augment-vir/common';
 *
 * // `result1` is `5.13`
 * const result1 = round(5.125, {digits: 2});
 * // `result2` is `5`
 * const result2 = round(25, {digits: 2});
 * ```
 *
 * @package @augment-vir/common
 */
export function round(value: number, {digits}: {digits: number}): number {
    const digitFactor = Math.pow(10, digits);
    const multiplied = value * digitFactor;

    return Number((Math.round(multiplied) / digitFactor).toFixed(digits));
}
