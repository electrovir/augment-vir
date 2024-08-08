import {MinMax} from './min-max.js';

/**
 * Clamp's the given value to within the min and max bounds, inclusive.
 *
 * @category Number:Common
 */
export function clamp(value: number, {min, max}: MinMax) {
    return Math.min(Math.max(value, min), max);
}
