import {clamp, ensureMinAndMax} from './common-number';

function accessCrypto(): Crypto {
    if (globalThis.crypto) {
        return globalThis.crypto;
    } else {
        return require('crypto').webcrypto;
    }
}

const crypto = accessCrypto();

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

const validStringCharacters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
];

/**
 * Creates a random string (including letters and numbers) of a given length.
 *
 * This function uses cryptographically secure randomness.
 */
export function randomString(inputLength: number = 16): string {
    let stringBuilder = '';
    for (let i = 0; i < inputLength; i++) {
        const index = randomInteger({
            min: 0,
            max: validStringCharacters.length - 1,
        });
        stringBuilder += validStringCharacters[index];
    }
    return stringBuilder;
}
