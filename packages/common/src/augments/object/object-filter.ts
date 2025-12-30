import {
    type AnyObject,
    type CompleteValues,
    type ExcludeKeysWithMatchingValues,
    type ExtractKeysWithMatchingValues,
} from '@augment-vir/core';
import {type OptionalKeysOf, type RequiredKeysOf} from 'type-fest';
import {mapObject} from './map-entries.js';
import {mapObjectValues} from './map-values.js';
import {getObjectTypedEntries, typedObjectFromEntries} from './object-entries.js';

/**
 * Filters an object. Like
 * [`[].filter`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)
 * but for objects.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {filterObject} from '@augment-vir';
 *
 * filterObject({a: 1, b: 2, c: 3}, (key, value) => {
 *     return value >= 2;
 * });
 * // output is `{b: 2, c: 3}`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function filterObject<ObjectGeneric>(
    inputObject: Readonly<ObjectGeneric>,
    callback: (
        key: keyof ObjectGeneric,
        value: CompleteValues<ObjectGeneric>,
        fullObject: ObjectGeneric,
    ) => boolean,
): Partial<ObjectGeneric> {
    const filteredEntries = getObjectTypedEntries(inputObject).filter(
        ([
            key,
            value,
        ]) => {
            return callback(key, value, inputObject);
        },
    );
    return typedObjectFromEntries(filteredEntries) as Partial<ObjectGeneric>;
}

/**
 * Converts any optionally `undefined` keys to partials with non-undefined values. This does not
 * exclude `null` (but {@link RemoveNullishValues} does).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RemoveUndefinedValues<ObjectGeneric> = string extends keyof ObjectGeneric
    ? Record<string, Exclude<ObjectGeneric[keyof ObjectGeneric], undefined>>
    : {
          [Key in ExcludeKeysWithMatchingValues<ObjectGeneric, undefined>]: ObjectGeneric[Key];
      } & {
          [Key in ExtractKeysWithMatchingValues<ObjectGeneric, undefined>]?: Exclude<
              ObjectGeneric[Key],
              undefined
          >;
      };

/**
 * Converts any optionally `undefined` or `null` keys to partials with non-nullable values.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RemoveNullishValues<ObjectGeneric> = {
    [Key in ExcludeKeysWithMatchingValues<ObjectGeneric, undefined | null>]: ObjectGeneric[Key];
} & {
    [Key in ExtractKeysWithMatchingValues<ObjectGeneric, undefined | null>]?: NonNullable<
        ObjectGeneric[Key]
    >;
};

/**
 * Converts any `undefined` values into `null`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ReplaceUndefinedValuesWithNull<ObjectGeneric> = {
    [Key in RequiredKeysOf<Extract<ObjectGeneric, object>>]: undefined extends ObjectGeneric[Key]
        ? Exclude<ObjectGeneric[Key], undefined> | null
        : ObjectGeneric[Key];
} & {
    [Key in OptionalKeysOf<
        Extract<ObjectGeneric, object>
    >]?: undefined extends Required<ObjectGeneric>[Key]
        ? Exclude<ObjectGeneric[Key], undefined> | null
        : ObjectGeneric[Key];
};

/**
 * Converts any `null` values into `undefined`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ReplaceNullValuesWithUndefined<ObjectGeneric> = {
    [Key in RequiredKeysOf<Extract<ObjectGeneric, object>>]: null extends ObjectGeneric[Key]
        ? Exclude<ObjectGeneric[Key], null> | undefined
        : ObjectGeneric[Key];
} & {
    [Key in OptionalKeysOf<
        Extract<ObjectGeneric, object>
    >]?: null extends Required<ObjectGeneric>[Key]
        ? Exclude<ObjectGeneric[Key], null> | undefined
        : ObjectGeneric[Key];
};

/**
 * Removes keys for values that are `undefined`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function removeUndefinedValues<ObjectGeneric>(
    input: Readonly<ObjectGeneric>,
): RemoveUndefinedValues<ObjectGeneric> {
    return mapObject(input, (key, value) => {
        if (value === undefined) {
            return undefined;
        } else {
            return {
                key,
                value,
            };
        }
    }) as AnyObject as RemoveUndefinedValues<ObjectGeneric>;
}

/**
 * Removes keys for values that are `undefined` or `null`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function removeNullishValues<ObjectGeneric>(
    input: Readonly<ObjectGeneric>,
): RemoveNullishValues<ObjectGeneric> {
    return mapObject(input, (key, value) => {
        if (value == undefined) {
            return undefined;
        } else {
            return {
                key,
                value,
            };
        }
    }) as AnyObject as RemoveNullishValues<ObjectGeneric>;
}

/**
 * Replaces all `undefined` values with `null`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function replaceUndefinedValuesWithNull<ObjectGeneric>(
    input: Readonly<ObjectGeneric>,
): ReplaceUndefinedValuesWithNull<ObjectGeneric> {
    return mapObjectValues(input, (key, value) =>
        value === undefined ? null : value,
    ) as ReplaceUndefinedValuesWithNull<ObjectGeneric>;
}

/**
 * Replaces all `null` values with `undefined`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function replaceNullValuesWithUndefined<ObjectGeneric>(
    input: Readonly<ObjectGeneric>,
): ReplaceNullValuesWithUndefined<ObjectGeneric> {
    return mapObjectValues(input, (key, value) =>
        value === null ? undefined : value,
    ) as ReplaceNullValuesWithUndefined<ObjectGeneric>;
}
