/**
 * Matches a class constructor.
 *
 * Copied from the `Constructor` type in the `type-fest` package so that this package's public types
 * do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Constructor<T, Arguments extends unknown[] = any[]> = new (
    ...constructorArguments: Arguments
) => T;

/**
 * Matches a class constructor with an abstract signature.
 *
 * Copied from the `AbstractConstructor` type in the `type-fest` package so that this package's
 * public types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type AbstractConstructor<T, Arguments extends unknown[] = any[]> = abstract new (
    ...constructorArguments: Arguments
) => T;

/**
 * Matches a
 * [`class`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/class).
 *
 * Copied from the `Class` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Class<T, Arguments extends unknown[] = any[]> = {
    prototype: Pick<T, keyof T>;
    new (...constructorArguments: Arguments): T;
};

/**
 * Matches an [`abstract
 * class`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes#abstract_classes).
 *
 * Copied from the `AbstractClass` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type AbstractClass<T, Arguments extends unknown[] = any[]> = AbstractConstructor<
    T,
    Arguments
> & {
    prototype: Pick<T, keyof T>;
};
