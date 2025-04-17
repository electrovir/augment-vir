import type {AnyObject} from '@augment-vir/core';
import {mapObjectValues} from '../object/map-values.js';

/**
 * Awaits all Promise properties inside of the given object and wraps them all in a single promise.
 * This is akin to `Promise.all` but for an object instead of an array.
 *
 * @category Promise
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export async function awaitAllPromisesInObject<const OriginalObject extends AnyObject>(
    originalObject: OriginalObject,
): Promise<{[Key in keyof OriginalObject]: Awaited<OriginalObject[Key]>}> {
    return mapObjectValues(originalObject, (key, value) => value) as Promise<{
        [Key in keyof OriginalObject]: Awaited<OriginalObject[Key]>;
    }>;
}
