import type {ArrayElement} from '../array/array.js';

/**
 * All characters that are considered punctuation.
 *
 * @category String : Common
 * @package @augment-vir/common
 */
export const punctuationLetters = [
    '.',
    ':',
    ';',
    ',',
    '?',
    '!',
] as const;

/**
 * A RegExp matching all letters that are considered punctuation.
 *
 * @category String : Common
 * @category RegExp : Common
 * @package @augment-vir/common
 */
export const punctuationRegExp = new RegExp(`[${punctuationLetters.join('')}]+`);

/**
 * A RegExp matching that matches any punctuation at the end of a string.
 *
 * @category String : Common
 * @category RegExp : Common
 * @package @augment-vir/common
 */
export const endsWithPunctuationRegExp = new RegExp(`[${punctuationLetters.join('')}]+$`);

/**
 * All characters that are considered punctuation.
 *
 * @category String : Common
 * @package @augment-vir/common
 */
export type PunctuationLetter = ArrayElement<typeof punctuationLetters>;

/**
 * Removes any punctuation at the end of the given string.
 *
 * @category String : Common
 * @package @augment-vir/common
 */
export function removeEndingPunctuation(value: string): string {
    return value.replace(endsWithPunctuationRegExp, '');
}
