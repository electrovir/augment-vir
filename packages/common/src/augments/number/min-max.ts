/**
 * @category Number
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type MinMax = {
    min: number;
    max: number;
};

/**
 * Given a min and max, ensures that they are in correct order. Meaning, min is less than max. If
 * that is not the case, values are swapped.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export function ensureMinMax({min, max}: MinMax): MinMax {
    if (min > max) {
        return {min: max, max: min};
    } else {
        return {min, max};
    }
}
