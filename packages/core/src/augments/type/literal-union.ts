import {type Primitive} from './primitive-type.js';

/**
 * Create a union type by combining primitive types and literal types without sacrificing
 * auto-completion in IDEs for the literal type part of the union.
 *
 * Copied from the `LiteralUnion` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type LiteralUnion<LiteralType, BaseType extends Primitive> =
    | LiteralType
    | (BaseType & Record<never, never>);
