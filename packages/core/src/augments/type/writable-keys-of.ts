import {type ReadonlyKeysOf} from './readonly-keys-of.js';

/**
 * Extract all writable keys from the given type.
 *
 * Copied from the `WritableKeysOf` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type WritableKeysOf<Type extends object> = Type extends unknown
    ? Exclude<keyof Type, ReadonlyKeysOf<Type>>
    : never;
