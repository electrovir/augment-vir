import {check} from '@augment-vir/assert';
import {addRegExpFlags} from '@augment-vir/common';
import {escapeStringForRegExp} from '../regexp/regexp-string.js';

/**
 * A case insensitive match between strings or RegExp.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function match(haystack: string, needle: string | RegExp): boolean {
    if (!needle) {
        return false;
    } else if (check.isString(needle)) {
        return !!new RegExp(escapeStringForRegExp(needle), 'i').exec(haystack);
    } else {
        return !!addRegExpFlags(needle, 'i').exec(haystack);
    }
}
