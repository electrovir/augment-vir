import {webcrypto as crypto, randomBytes} from 'crypto';

export function randomBoolean(percentLikelyToBeTrue: number = 50): boolean {
    return randomInteger({min: 0, max: 49}) < percentLikelyToBeTrue / 2;
}

export function createUuid() {
    return crypto.randomUUID();
}

export function randomInteger({min, max}: {min: number; max: number}): number {
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
    return Math.floor(min + (value % range));
}

export function randomString(inputLength: number = 16): string {
    const arrayLength = Math.ceil(inputLength / 2);
    return (
        randomBytes(arrayLength)
            .toString('hex')
            /**
             * Because randomBytes works with even numbers only, we must then chop off extra
             * characters if they exist in the even that inputLength was odd.
             */
            .substring(0, inputLength)
    );
}
