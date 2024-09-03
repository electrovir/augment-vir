import {randomString} from '../random/random-string.js';

/**
 * Shuffles the positions of an array's entries (without mutating the array).
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @returns A new array (does not mutate).
 * @package @augment-vir/common
 */
export function shuffleArray<ArrayElementType>(
    input: ReadonlyArray<ArrayElementType>,
): Array<ArrayElementType> {
    return input
        .map((value) => {
            return {value, sort: randomString()};
        })
        .sort((a, b) => a.sort.localeCompare(b.sort))
        .map(({value}) => value);
}
