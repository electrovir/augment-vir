import {type AnyObject} from './generic-object-type.js';
import {type Values} from './object-value-types.js';

/**
 * Optional comparison parameter type for {@link sortObject}.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type SortObjectComparison<T extends AnyObject> = (
    a: {key: keyof T; value: Values<T>},
    b: {key: keyof T; value: Values<T>},
) => number;

/**
 * Creates as new sorted object copied from the the original given object.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function sortObject<const T extends AnyObject>(
    original: Readonly<T>,
    /**
     * A custom comparison for the sort. By default, only the keys are sorted with default string
     * sorting.
     */
    comparison?: SortObjectComparison<T> | undefined,
): T {
    return recursivelySortObject(original, new Map(), comparison);
}

function recursivelySortObject(
    original: unknown,
    seen: Map<any, any>,
    comparison: SortObjectComparison<any> | undefined,
) {
    if (
        original &&
        typeof original === 'object' &&
        !Array.isArray(original) &&
        original.constructor === Object
    ) {
        if (seen.has(original)) {
            return seen.get(original);
        }

        /** Immediately store in {@link seen} so any circular references can immediately reuse this. */
        const sortedClone: AnyObject = {};
        seen.set(original, sortedClone);

        Object.entries(original)
            .sort((a, b) => {
                if (comparison) {
                    return comparison({key: a[0], value: a[1]}, {key: b[0], value: b[1]});
                } else {
                    return a[0].localeCompare(b[0]);
                }
            })
            .forEach(
                ([
                    key,
                    value,
                ]) => {
                    const mappedValue = recursivelySortObject(value, seen, comparison);
                    sortedClone[key] = mappedValue;
                },
            );

        return sortedClone;
    } else {
        return original;
    }
}
