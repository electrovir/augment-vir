import {type Primitive} from './primitive-type.js';

/**
 * Matches any primitive, `void`, `Date`, or `RegExp` value.
 *
 * Copied from the internal `BuiltIns` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type BuiltIns = Primitive | void | Date | RegExp;

/**
 * Tests if the given function has multiple call signatures. Needed to handle the case of a single
 * call signature with properties, as multiple call signatures cannot currently be supported due to
 * a TypeScript limitation.
 *
 * Copied from the internal `HasMultipleCallSignatures` type in the `type-fest` package so that this
 * package's public types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> = T extends {
    (...arguments_: infer A): unknown;
    (...arguments_: infer B): unknown;
}
    ? B extends A
        ? A extends B
            ? false
            : true
        : true
    : false;
