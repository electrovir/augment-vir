import {ensureMinMax} from '../number/min-max.js';

/**
 * Creates a random integer (no decimal points are included) between the given min and max values
 * (inclusive).
 *
 * This function uses cryptographically secure randomness.
 *
 * @category Random:Common
 */
export function randomInteger({min: rawMin, max: rawMax}: {min: number; max: number}): number {
    const {min, max} = ensureMinMax({min: Math.floor(rawMin), max: Math.floor(rawMax)});
    const range = max - min + 1;
    const bitsNeeded = Math.ceil(Math.log2(range));

    const neededBytes = Math.ceil(bitsNeeded / 8);
    /**
     * Testing on my system maxes out at 65,536 (Node) or 65,537 (Safari / Chrome / Firefox) bytes.
     * I don't know why, and that may be system dependent, I don't know.
     */
    if (neededBytes > 65_000) {
        throw new RangeError(
            `Cannot create a random integer so large. ({min: ${min}, max: ${max}})`,
        );
    }
    const cutoff = Math.floor(256 ** neededBytes / range) * range;
    const currentBytes = new Uint8Array(neededBytes);
    let value;
    do {
        crypto.getRandomValues(currentBytes);
        value = currentBytes.reduce((accum, byte, index) => {
            return accum + byte * 256 ** index;
        }, 0);
    } while (value >= cutoff);
    return min + (value % range);
}
