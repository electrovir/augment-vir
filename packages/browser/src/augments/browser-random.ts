import {ensureMinAndMax} from '../../../common/src';
const crypto = globalThis.crypto;

/**
 * Creates a random integer (decimal points are all cut off) between the given min and max
 * (inclusive).
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

export function randomBoolean(percentLikelyToBeTrue: number = 50): boolean {
    return randomInteger({min: 0, max: 99}) < percentLikelyToBeTrue;
}

export function uuid() {
    return crypto.randomUUID();
}

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
