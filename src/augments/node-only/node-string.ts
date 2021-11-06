import {randomBytes} from 'crypto';

/**
 * This is explicitly separate from the other string.ts file because frontend bundlers try to be
 * smart and will grab a crypto import even if it's inlined and dynamic (like a
 * require('crypto').randomBytes call).
 */
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
