import {randomInteger} from '../random/random-integer.js';
import {type SeededRandom} from '../random/seeded-random.js';

/**
 * Shuffles the positions of an array's entries (without mutating the array).
 *
 * Pass a {@link SeededRandom} instance to get the same order every time from the same seed. Without
 * one, this uses cryptographically secure randomness.
 *
 * @category Array
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {SeededRandom, shuffleArray} from '@augment-vir/common';
 *
 * shuffleArray([
 *     1,
 *     2,
 *     3,
 * ]); // a different order each time
 * shuffleArray(
 *     [
 *         1,
 *         2,
 *         3,
 *     ],
 *     SeededRandom.fromSeed('hello there'),
 * ); // always the same order
 * ```
 *
 * @returns A new array (does not mutate).
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function shuffleArray<ArrayElementType>(
    input: ReadonlyArray<ArrayElementType>,
    seededRandom?: Readonly<Pick<SeededRandom, 'next'>> | undefined,
): Array<ArrayElementType> {
    const shuffled = [...input];

    /** Fisher-Yates shuffle. */
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = seededRandom
            ? Math.floor(seededRandom.next() * (index + 1))
            : randomInteger({
                  min: 0,
                  max: index,
              });

        [
            shuffled[index],
            shuffled[swapIndex],
        ] = [
            shuffled[swapIndex] as ArrayElementType,
            shuffled[index] as ArrayElementType,
        ];
    }

    return shuffled;
}
