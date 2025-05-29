import {ensureMinMax, type MinMax, type PartialWithUndefined} from '@augment-vir/core';

/**
 * If the given value is outside the given min/max bounds, instead of clamping the number (as the
 * `clamp` function does), this function wraps the value around to the next bound (inclusive).
 *
 * If `takeOverflow` is set to `true`, then any excess after wrapping is continually iterated over
 * and wrapped again, potentially resulting in wrapping through the min/max bounds multiple times.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {wrapNumber} from '@augment-vir/common';
 *
 * wrapNumber(101, {min: 0, max: 100}); // 0
 * wrapNumber(-1, {min: 0, max: 100}); // 100
 * wrapNumber(-7, {min: 0, max: 3, takeOverflow: true}); // 1
 * wrapNumber(13, {min: 0, max: 3, takeOverflow: true}); // 1
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function wrapNumber(
    value: number,
    minMax: Readonly<MinMax> &
        PartialWithUndefined<{
            /**
             * If `true`, the overflow of the wrap is added to the bound wrapped to.
             *
             * @default false
             */
            takeOverflow: boolean;
        }>,
): number {
    const {min, max} = ensureMinMax(minMax);

    if (minMax.takeOverflow) {
        const diff = max - min + 1;

        const offset = (value - min) % diff;

        if (offset < 0) {
            return min + diff + offset;
        } else {
            return min + offset;
        }
    } else {
        if (value > max) {
            return min;
        } else if (value < min) {
            return max;
        }

        return value;
    }
}
