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
     * Block characters that don't have different upper and lower case versions (such as
     * punctuation).
     */
    blockNoCaseCharacters: boolean;
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
    if (!input && options?.blockNoCaseCharacters) {
        return false;
    }

    for (const element of input) {
        const letter = element || '';

        if (!hasCase(letter)) {
            if (options?.blockNoCaseCharacters) {
                return false;
            } else {
                continue;
            }
        }

        if (caseType === StringCaseEnum.Upper && letter !== letter.toUpperCase()) {
            return false;
        } else if (caseType === StringCaseEnum.Lower && letter !== letter.toLowerCase()) {
            return false;
        }
    }

    return true;
}
