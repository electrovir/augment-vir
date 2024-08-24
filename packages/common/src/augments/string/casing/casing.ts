import {PartialWithUndefined} from '@augment-vir/core';

export type CasingOptions = {
    capitalizeFirstLetter: boolean;
};

export const defaultCasingOptions: Required<CasingOptions> = {
    capitalizeFirstLetter: false,
};

export enum StringCaseEnum {
    Upper = 'upper',
    Lower = 'lower',
}

/** Indicates whether the given string has different lower and upper case variants. */
export function hasCase(input: string): boolean {
    return input.toLowerCase() !== input.toUpperCase();
}

export type IsCaseOptions = {
    /**
     * Fail on characters that don't have different upper and lower case versions (such as
     * punctuation, like `'.'` or symbols, like `'√'`).
     */
    failOnNoCaseCharacters: boolean;
};

/**
 * Checks if the given string is exclusively of the specific case.
 *
 * Note that some characters have no casing, such as punctuation (they have no difference between
 * upper and lower casings). By default, those letters always return `true` for this function,
 * regardless of which `caseType` is provided. To instead return `false` for any such characters,
 * pass in an options object and set blockNoCaseCharacters to true.
 */
export function isCase(
    input: string,
    caseType: StringCaseEnum,
    options?: PartialWithUndefined<IsCaseOptions>,
): boolean {
    if (!input && options?.failOnNoCaseCharacters) {
        return false;
    }

    for (const letter of input) {
        if (!hasCase(letter)) {
            if (options?.failOnNoCaseCharacters) {
                return false;
            } else {
                continue;
            }
        } else if (
            (caseType === StringCaseEnum.Upper && letter !== letter.toUpperCase()) ||
            (caseType === StringCaseEnum.Lower && letter !== letter.toLowerCase())
        ) {
            return false;
        }
    }

    return true;
}
