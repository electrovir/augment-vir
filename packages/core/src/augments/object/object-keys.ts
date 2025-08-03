/**
 * Gets all keys of an object. This is similar to
 * [`Object.keys`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
 * except that it also grabs symbol keys and has better TypeScript typing.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getObjectTypedKeys<const ObjectGeneric>(
    input: ObjectGeneric,
): Array<keyof ObjectGeneric> {
    let reflectKeys: Array<keyof ObjectGeneric> | undefined;
    try {
        reflectKeys = Reflect.ownKeys(input as object) as unknown as Array<keyof ObjectGeneric>;
    } catch {
        // do nothing
    }
    return (
        reflectKeys ??
        ([
            ...Object.keys(input as object),
            ...Object.getOwnPropertySymbols(input as object),
        ] as unknown as Array<keyof ObjectGeneric>)
    );
}

/**
 * Performs `keyof` on all keys within the `Original` that have values matching the given `Matcher`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {ExtractKeysWithMatchingValues} from '@augment-vir/common';
 *
 * type ExtractedKeys = ExtractKeysWithMatchingValues<{a: RegExp; b: string}, string>;
 * // `ExtractedKeys` is `'b'`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ExtractKeysWithMatchingValues<Original, Matcher> = keyof {
    [Key in keyof Original as Original[Key] extends Matcher
        ? Key
        : Matcher extends Original[Key]
          ? Key
          : never]: Key;
};

/**
 * Performs `keyof` on all keys within the `OriginalObject` that have values _not_ matching the
 * given `Matcher`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {ExcludeKeysWithMatchingValues} from '@augment-vir/common';
 *
 * type ExcludedKeys = ExcludeKeysWithMatchingValues<{a: RegExp; b: string}, string>;
 * // `ExcludedKeys` is `'a'`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ExcludeKeysWithMatchingValues<Original, Matcher> = keyof {
    [Key in keyof Original as Original[Key] extends Matcher
        ? never
        : Matcher extends Original[Key]
          ? never
          : Key]: Key;
};
