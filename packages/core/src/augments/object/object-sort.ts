import {type AnyObject} from './generic-object-type.js';

/**
 * Creates as new sorted object copied from the the original given object.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function sortObject<const T extends AnyObject>(original: Readonly<T>): T {
    return recursivelySortObject(original, new Map());
}

function recursivelySortObject(original: unknown, seen: Map<any, any>) {
    if (original && typeof original === 'object' && !Array.isArray(original)) {
        if (seen.has(original)) {
            return seen.get(original);
        }

        /** Immediately store in {@link seen} so any circular references can immediately reuse this. */
        const sortedClone: AnyObject = {};
        seen.set(original, sortedClone);

        Object.entries(original)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .forEach(
                ([
                    key,
                    value,
                ]) => {
                    const mappedValue = recursivelySortObject(value, seen);
                    sortedClone[key] = mappedValue;
                },
            );

        return sortedClone;
    } else {
        return original;
    }
}
