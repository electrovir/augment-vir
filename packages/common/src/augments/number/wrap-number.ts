// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {clamp} from './clamp.js';
import {ensureMinMax, MinMax} from './min-max.js';

/**
 * If the given value is outside the given min/max bounds, instead of clamping the number (as the
 * {@link clamp} function does), this function wraps the value around to the next bound (inclusive).
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {wrapNumber} from '@augment-vir/common';
 *
 * wrapNumber({min: 0, max: 100, value: 101}); // 0
 * wrapNumber({min: 0, max: 100, value: -1}); // 100
 * ```
 *
 * @package @augment-vir/common
 */
export function wrapNumber(value: number, minMax: Readonly<MinMax>): number {
    const {min, max} = ensureMinMax(minMax);

    if (value > max) {
        return min;
    } else if (value < min) {
        return max;
    }

    return value;
}
