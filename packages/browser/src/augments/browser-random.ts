import {clamp, ensureMinAndMax} from '@augment-vir/common';
const crypto = globalThis.crypto;

/**
 * Creates a random integer (decimal points are all cut off) between the given min and max
 * (inclusive).
 *
 * This function uses cryptographically secure randomness.
 */
export function randomInteger({min: rawMin, max: rawMax}: {min: number; max: number}): number {
    const {min, max} = ensureMinAndMax({min: Math.floor(rawMin), max: Math.floor(rawMax)});
    const range = max - min + 1;
    const neededByteCount = Math.ceil(Math.log2(range) / 8);
    const cutoff = Math.floor(256 ** neededByteCount / range) * range;
    const currentBytes = new Uint8Array(neededByteCount);
    let value;
    do {
        crypto.getRandomValues(currentBytes);
        value = currentBytes.reduce((accum, byte, index) => {
            return accum + byte * 256 ** index;
        }, 0);
    } while (value >= cutoff);
    return min + (value % range);
}

/**
 * Returns true at rate of the percentLikelyToBeTrue input. Inputs should be whole numbers which
 * will be treated like percents. Anything outside of 0-100 inclusively will be clamped. An input 0
 * will always return true. An input of 100 will always return true. Decimals on the input will be
 * chopped off, use whole numbers.
 *
 * This function uses cryptographically secure randomness.
 *
 * @example
 *     randomBoolean(50); // 50% chance to return true
 *
 * @example
 *     randomBoolean(0); // always false, 0% chance of being true
 *
 * @example
 *     randomBoolean(100); // always true, 100% chance of being true
 *
 * @example
 *     randomBoolean(59.67; // 59% chance of being true
 */
export function randomBoolean(percentLikelyToBeTrue: number = 50): boolean {
    return (
        randomInteger({min: 0, max: 99}) <
        clamp({
            value: Math.floor(percentLikelyToBeTrue),
            min: 0,
            max: 100,
        })
    );
}

/** Creates a cryptographically secure uuid. */
export function createUuid() {
    return crypto.randomUUID();
}

/**
 * Creates a random string (including letters and numbers) of a given length.
 *
 * This function uses cryptographically secure randomness.
 */
export function randomString(inputLength: number = 16): string {
    const arrayLength = Math.ceil(inputLength / 2);
    const uintArray = new Uint8Array(arrayLength);
    crypto.getRandomValues(uintArray);
    return (
        Array.from(uintArray)
            .map((value) => value.toString(16).padStart(2, '0'))
            .join('')
            /**
             * Because getRandomValues works with even numbers only, we must then chop off extra
             * characters if they exist in the even that inputLength was odd.
             */
            .substring(0, inputLength)
    );
}
