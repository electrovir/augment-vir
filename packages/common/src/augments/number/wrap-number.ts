import {ensureMinMax, MinMax} from './min-max.js';

/**
 * If the given value is outside the given min/max bounds, instead of clamping the number (as the
 * `clamp` function does), this function wraps the value around to the next bound.
 *
 * @category Number:Common
 * @example
 *     wrapNumber({min: 0, max: 100, value: 101}) == 0;
 */
export function wrapNumber(value: number, minMax: MinMax): number {
    const {min, max} = ensureMinMax(minMax);

    if (value > max) {
        return min;
    } else if (value < min) {
        return max;
    }

    return value;
}
