/* eslint-disable @typescript-eslint/no-empty-object-type -- faithful copy of type-fest, which intentionally uses the `{}` identity type. */
import {type IsEqual} from './type-checks.js';

type Filter<KeyType, ExcludeType> =
    IsEqual<KeyType, ExcludeType> extends true
        ? never
        : KeyType extends ExcludeType
          ? never
          : KeyType;

/**
 * Options for {@link Except}.
 *
 * Copied from the `ExceptOptions` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ExceptOptions = {
    /**
     * Disallow assigning non-specified properties.
     *
     * @default false
     */
    requireExactProps?: boolean;
};

/**
 * Create a type from an object type without certain keys. This is a stricter version of the
 * built-in `Omit` type: it restricts the omitted keys to keys present on the given type.
 *
 * Copied from the `Except` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Except<
    ObjectType,
    KeysType extends keyof ObjectType,
    Options extends ExceptOptions = {},
> = {
    [KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
} & (Options extends {requireExactProps: true} ? Partial<Record<KeysType, never>> : {});
