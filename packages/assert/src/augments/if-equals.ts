import type {IsEqual} from 'type-fest';

/**
 * A helper type that resolves to the given `Yes` type parameter if `Actual` === `Expected`.
 * Otherwise it resolves to the given `No` type parameter.
 *
 * @category Assert : Util
 * @package @augment-vir/assert
 */
export type IfEquals<Actual, Expected, Yes = unknown, No = never> =
    IsEqual<Actual, Expected> extends true ? Yes : No;

/**
 * A helper type that resolves to the given `Yes` type parameter if `Actual` extends `Expected`.
 * Otherwise it resolves to the given `No` type parameter.
 *
 * @category Assert : Util
 * @package @augment-vir/assert
 */
export type IfExtends<Actual, Expected, Yes = unknown, No = never> = Actual extends Expected
    ? Yes
    : No;
