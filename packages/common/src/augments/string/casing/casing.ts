import {PartialWithUndefined} from '@augment-vir/core';

/**
 * Options for casing functions in `@augment-vir/common`.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type CasingOptions = {
    /**
     * Capitalize the first letter of the string.
     *
     * @default false
     */
    capitalizeFirstLetter: boolean;
};

/**
 * Default options for {@link CasingOptions}.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export const defaultCasingOptions: Required<CasingOptions> = {
    capitalizeFirstLetter: false,
};

/**
 * The different string cases.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export enum StringCase {
    Upper = 'upper',
    Lower = 'lower',
}

/**
 * Indicates whether the given string has different lower and upper case variants. (Some strings
 * don't, such as all numbers or `'√'`.)
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export function hasCase(input: string): boolean {
    return input.toLowerCase() !== input.toUpperCase();
}

/**
 * Options for {@link isCase}.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type IsCaseOptions = {
    /**
     * Set to `true` to fail on characters that don't have different upper and lower case versions
     * (such as punctuation, like `'.'` or symbols, like `'√'`).
     *
     * @default false
     */
    rejectNoCaseCharacters: boolean;
};

/**
 * Checks if the given string is exclusively of the specific case.
 *
 * Note that some characters have no casing, such as punctuation (they have no difference between
 * upper and lower casings). By default, those letters always return `true` for this function,
 * regardless of which `caseType` is provided. To instead return `false` for any such characters,
 * pass in an options object and set `rejectNoCaseCharacters` to true.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export function isCase(
    input: string,
    caseType: StringCase,
    options?: PartialWithUndefined<IsCaseOptions>,
): boolean {
    if (!input && options?.rejectNoCaseCharacters) {
        return false;
    }

    for (const letter of input) {
        if (!hasCase(letter)) {
            if (options?.rejectNoCaseCharacters) {
                return false;
            } else {
                continue;
            }
        } else if (
            (caseType === StringCase.Upper && letter !== letter.toUpperCase()) ||
            (caseType === StringCase.Lower && letter !== letter.toLowerCase())
        ) {
            return false;
        }
    }

    return true;
}
