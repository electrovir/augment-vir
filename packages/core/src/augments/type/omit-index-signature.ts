/* eslint-disable @typescript-eslint/no-empty-object-type -- faithful copy of type-fest, which intentionally uses the `{}` identity type. */

/**
 * Omit any index signatures from the given object type, leaving only explicitly defined properties.
 * This is the counterpart of `PickIndexSignature`.
 *
 * Copied from the `OmitIndexSignature` type in the `type-fest` package so that this package's
 * public types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type OmitIndexSignature<ObjectType> = {
    [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
        ? never
        : KeyType]: ObjectType[KeyType];
};

/**
 * Pick only index signatures from the given object type, leaving out all explicitly defined
 * properties. This is the counterpart of {@link OmitIndexSignature}.
 *
 * Copied from the `PickIndexSignature` type in the `type-fest` package so that this package's
 * public types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PickIndexSignature<ObjectType> = {
    [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
        ? KeyType
        : never]: ObjectType[KeyType];
};
