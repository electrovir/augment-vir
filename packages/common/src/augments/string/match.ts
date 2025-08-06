import {escapeStringForRegExp} from '@augment-vir/common';

/**
 * A case insensitive match between strings.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function match(haystack: string, needle: string): boolean {
    return !!needle && !!new RegExp(escapeStringForRegExp(needle), 'i').exec(haystack);
}
