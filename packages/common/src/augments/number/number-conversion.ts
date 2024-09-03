import {removeCommas} from '../string/comma.js';

/**
 * Converts the input into a number and returns `NaN` if the conversion fails. This handles more
 * edge cases than just plain `Number(input)`.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @returns The converted number or `NaN`.
 * @package @augment-vir/common
 */
export function toNumber(input: unknown): number {
    if (typeof input === 'number') {
        return input;
    } else if (typeof input === 'string') {
        return Number(removeCommas(input));
    } else {
        return Number(input);
    }
}

/**
 * Converts the input into a number and throws an error if the conversion fails.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @returns The converted number
 * @throws `TypeError` if the conversion resulted in `NaN`
 * @package @augment-vir/common
 */
export function toEnsuredNumber(input: unknown): number {
    const maybeNumber = toMaybeNumber(input);

    if (maybeNumber == undefined) {
        throw new TypeError(`Cannot convert to a number: ${String(input)}`);
    } else {
        return maybeNumber;
    }
}

/**
 * Converts the input into a number and returns `undefined` if the conversion fails.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @returns The converted number or `undefined`.
 * @package @augment-vir/common
 */
export function toMaybeNumber(input: unknown): number | undefined {
    const numeric = toNumber(input);

    if (isNaN(numeric)) {
        return undefined;
    } else {
        return numeric;
    }
}
