import {getOrSet} from './get-or-set.js';

export function mergePropertyArrays<T extends Record<PropertyKey, unknown[]>>(
    ...inputs: ReadonlyArray<Readonly<T>>
): T {
    const combined: Record<PropertyKey, unknown[]> = {};

    inputs.forEach((input) => {
        Object.entries(input).forEach(
            ([
                key,
                newArray,
            ]) => {
                const currentArray = getOrSet(combined, key, () => []);
                currentArray.push(...newArray);
            },
        );
    });

    return combined as T;
}
