import {MinMax} from './min-max.js';

/**
 * Clamp's the given value to within the min and max bounds, inclusive.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {clamp} from '@augment-vir/common';
 *
 * // `result` will be `40`
 * const result = clamp(42, {min: 30, max: 40});
 * ```
 *
 * @package @augment-vir/common
 */
export function clamp(value: number, {min, max}: Readonly<MinMax>) {
    return Math.min(Math.max(value, min), max);
}
