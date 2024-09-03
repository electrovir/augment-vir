import {CompleteRequire, getObjectTypedKeys} from '@augment-vir/core';

/**
 * Gets an object's entries. This is the same as
 * [`Object.entries`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
 * except that it has better TypeScript types.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getObjectTypedEntries<const ObjectGeneric>(
    input: ObjectGeneric,
): [keyof ObjectGeneric, CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>]][] {
    return getObjectTypedKeys(input).map((key) => [
        key,
        input[key],
    ]) as [
        keyof ObjectGeneric,
        CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>],
    ][];
}

/**
 * Create an object from an array of entries. This is the same as
 * [`Object.fromEntries`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)
 * except that it has better TypeScript types.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function typedObjectFromEntries<const KeyType extends PropertyKey, const ValueType>(
    entries: ReadonlyArray<Readonly<[KeyType, ValueType]>>,
): Record<KeyType, ValueType> {
    return Object.fromEntries(entries) as Record<KeyType, ValueType>;
}

/**
 * Gets an object's entries and sorts them by their key values. This is the same as
 * [`Object.entries`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
 * except that it has better TypeScript types and sorts the entries.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getEntriesSortedByKey<const ObjectGeneric>(
    input: ObjectGeneric,
): [keyof ObjectGeneric, CompleteRequire<ObjectGeneric>[keyof CompleteRequire<ObjectGeneric>]][] {
    return getObjectTypedEntries(input).sort((tupleA, tupleB) =>
        String(tupleA[0]).localeCompare(String(tupleB[0])),
    );
}
