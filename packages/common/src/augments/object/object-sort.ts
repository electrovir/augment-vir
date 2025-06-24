import {type AnyObject} from '@augment-vir/core';

/**
 * Creates as new sorted object copied from the the original given object.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function sortObject<const T extends AnyObject>(original: Readonly<T>): T {
    return Object.fromEntries(
        Object.entries(original).sort((a, b) => a[0].localeCompare(b[0])),
    ) as T;
}
