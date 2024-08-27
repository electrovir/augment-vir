import type {ArrayElement} from '../array/array.js';

export const punctuationLetters = [
    '.',
    ':',
    ';',
    ',',
    '?',
    '!',
] as const;

export const punctuationRegExp = new RegExp(`[${punctuationLetters.join('')}]+`);
export const endsWithPunctuationRegExp = new RegExp(`[${punctuationLetters.join('')}]+$`);

export type PunctuationLetter = ArrayElement<typeof punctuationLetters>;

export function removeEndingPunctuation(value: string): string {
    return value.replace(endsWithPunctuationRegExp, '');
}
