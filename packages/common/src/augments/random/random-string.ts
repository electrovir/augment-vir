import {randomInteger} from './random-integer.js';

/**
 * All letters allowed in {@link randomString}.
 *
 * @category Random : Util
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const allowedRandomStringLetters: ReadonlyArray<string> = [
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
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
];

/**
 * Creates a random string (including letters and numbers) of a given length.
 *
 * This function uses cryptographically secure randomness.
 *
 * @category Random
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function randomString(generatedStringLength: number = 16): string {
    let stringBuilder = '';
    for (let i = 0; i < generatedStringLength; i++) {
        const index = randomInteger({
            min: 0,
            max: allowedRandomStringLetters.length - 1,
        });

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stringBuilder += allowedRandomStringLetters[index]!;
    }
    return stringBuilder;
}
