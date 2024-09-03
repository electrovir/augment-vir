import {clamp} from '../number/clamp.js';
import {randomInteger} from './random-integer.js';

/**
 * Returns true at rate of the percentLikelyToBeTrue input. Inputs should be whole numbers which
 * will be treated like percents. Anything outside of 0-100 inclusively will be clamped. An input 0
 * will always return true. An input of 100 will always return true. Decimals on the input will be
 * chopped off, use whole numbers.
 *
 * This function uses cryptographically secure randomness.
 *
 * @category Random
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {randomBoolean} from '@augment-vir/common';
 *
 * randomBoolean(50); // 50% chance to return true
 * randomBoolean(0); // always false, 0% chance of being true
 * randomBoolean(100); // always true, 100% chance of being true
 * randomBoolean(59.67); // 59% chance of being true
 * ```
 *
 * @package @augment-vir/common
 */
export function randomBoolean(percentLikelyToBeTrue: number = 50): boolean {
    return (
        randomInteger({min: 0, max: 99}) <
        clamp(Math.floor(percentLikelyToBeTrue), {
            min: 0,
            max: 100,
        })
    );
}
