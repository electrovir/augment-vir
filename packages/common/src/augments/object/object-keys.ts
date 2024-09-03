import {filterObject} from './object-filter.js';

/**
 * Same as the TypeScript built-in type `Omit` except that it works on actual runtime values.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {omitObjectKeys} from '@augment-vir/common';
 *
 * omitObjectKeys({a: 'a', b: 'b'}, ['a']);
 * // output is `{b: 'b'}`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function omitObjectKeys<const ObjectGeneric, const KeyGeneric extends keyof ObjectGeneric>(
    inputObject: Readonly<ObjectGeneric>,
    omitTheseKeys: ReadonlyArray<KeyGeneric>,
): Omit<ObjectGeneric, KeyGeneric> {
    return filterObject<ObjectGeneric>(inputObject, (currentKey) => {
        return !omitTheseKeys.includes(currentKey as KeyGeneric);
    }) as Omit<ObjectGeneric, KeyGeneric>;
}

/**
 * Same as the TypeScript built-in type `Pick` except that it works on actual runtime values.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {pickObjectKeys} from '@augment-vir/common';
 *
 * pickObjectKeys({a: 'a', b: 'b'}, ['a']);
 * // output is `{a: 'a'}`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function pickObjectKeys<const ObjectGeneric, const KeyGeneric extends keyof ObjectGeneric>(
    inputObject: Readonly<ObjectGeneric>,
    pickTheseKeys: ReadonlyArray<KeyGeneric>,
): Pick<ObjectGeneric, KeyGeneric> {
    return filterObject<ObjectGeneric>(inputObject, (currentKey) => {
        return pickTheseKeys.includes(currentKey as KeyGeneric);
    }) as Pick<ObjectGeneric, KeyGeneric>;
}
