import {mergeDefinedProperties} from '../../object/merge-defined-properties.js';
import {maybeCapitalize} from './capitalization.js';
import {CasingOptions, defaultCasingOptions, isCase, StringCaseEnum} from './casing.js';

/**
 * Converts a kebab-case string to CamelCase.
 *
 * @category String : Common
 * @package @augment-vir/common
 */
export function kebabCaseToCamelCase(
    rawKebabCase: string,
    casingOptions: Partial<CasingOptions> | undefined = {},
): string {
    const kebabCase = rawKebabCase.toLowerCase();
    if (!kebabCase.length) {
        return '';
    }

    const camelCase = kebabCase
        .replace(/^-+/, '')
        .replace(/-{2,}/g, '-')
        .replace(/-(?:.|$)/g, (dashMatch) => {
            const letter = dashMatch[1];
            if (letter) {
                return letter.toUpperCase();
            } else {
                return '';
            }
        });

    return maybeCapitalize(camelCase, mergeDefinedProperties(defaultCasingOptions, casingOptions));
}

/**
 * Converts a CamelCase string to kebab-case.
 *
 * @category String : Common
 * @package @augment-vir/common
 */
export function camelCaseToKebabCase(rawCamelCase: string) {
    const kebabCase: string = rawCamelCase
        .split('')
        .reduce((accum, currentLetter, index, originalString) => {
            const previousLetter: string = index > 0 ? originalString[index - 1] || '' : '';
            const nextLetter: string =
                index < originalString.length - 1 ? originalString[index + 1] || '' : '';
            const possibleWordBoundary =
                isCase(previousLetter, StringCaseEnum.Lower, {rejectNoCaseCharacters: true}) ||
                isCase(nextLetter, StringCaseEnum.Lower, {rejectNoCaseCharacters: true});

            if (
                currentLetter === currentLetter.toLowerCase() ||
                index === 0 ||
                !possibleWordBoundary
            ) {
                accum += currentLetter;
            } else {
                accum += `-${currentLetter.toLowerCase()}`;
            }
            return accum;
        }, '')
        .toLowerCase();

    return kebabCase;
}
