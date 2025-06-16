import {type AnyObject} from '@augment-vir/core';

export function sortObject<const T extends AnyObject>(original: T): T {
    return Object.fromEntries(
        Object.entries(original).sort((a, b) => a[0].localeCompare(b[0])),
    ) as T;
}
