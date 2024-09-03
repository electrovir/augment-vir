import JSON5 from 'json5';

/**
 * Converts the input into a string. Tries first with JSON5 and, if that fails, falls back to a
 * regular `.toString()` conversion.
 *
 * @category Object
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export function stringify(input: unknown) {
    try {
        return JSON5.stringify(input);
    } catch {
        return String(input);
    }
}
