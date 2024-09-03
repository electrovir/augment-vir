/**
 * Determines if the given number is so large that it requires scientific notation (`e`) when
 * represented as a string.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {requiresScientificNotation} from '@augment-vir/common';
 *
 * requiresScientificNotation(5); // false
 * requiresScientificNotation(999999999999999999999); // true
 * ```
 *
 * @package @augment-vir/common
 */
export function requiresScientificNotation(input: number): boolean {
    return String(input).includes('e');
}
