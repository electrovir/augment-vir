import {check} from '@augment-vir/assert';
import {type AnyObject} from '@augment-vir/core';

/**
 * Gets the type of a nested property within `Parent` by recursively accessing each key in `Keys`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type DeepValue<Parent extends AnyObject, Keys extends ReadonlyArray<PropertyKey>> =
    Keys extends Readonly<[infer First, ...infer Rest]>
        ? First extends keyof Parent
            ? Rest extends ReadonlyArray<PropertyKey>
                ? DeepValue<Parent[First], Rest>
                : undefined
            : undefined
        : Parent;

/**
 * Gets the value of a nested property within `Parent` by recursively accessing each key in `Keys`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getDeepValue<
    const Parent extends AnyObject,
    const Keys extends ReadonlyArray<PropertyKey>,
>(parent: Parent, keys: Readonly<Keys>): DeepValue<Parent, Keys> {
    if (!keys.length) {
        return parent as DeepValue<Parent, Keys>;
    }

    const innerParent = parent as Parent | undefined;

    const currentKey = keys[0];

    if (currentKey != undefined && check.hasKey(innerParent, currentKey)) {
        return getDeepValue(innerParent[currentKey], keys.slice(1));
    } else {
        return undefined as DeepValue<any, any>;
    }
}
