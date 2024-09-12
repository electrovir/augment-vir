import {addPrefix} from './prefix.js';
import {addSuffix} from './suffix.js';

/**
 * Wraps a string in another string.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {wrapString} from '@augment-vir/common';
 *
 * wrapString({value: 'some words', wrapper: '"'}); // outputs `'"some words"'`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function wrapString({value, wrapper}: {value: string; wrapper: string}): string {
    return addPrefix({value: addSuffix({value, suffix: wrapper}), prefix: wrapper});
}
