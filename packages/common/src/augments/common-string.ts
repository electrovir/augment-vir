import {ansiRegex} from './ansi';
import {deDupeRegExFlags} from './regexp';
import {AtLeastTuple} from './tuple';

/**
 * Join elements into a string with commas separating each value. Add a conjunction before the final
 * item in the list. If the array has a length < 2, the conjunction is not added. If the list is
 * only of length 2, then no commas are added.
 *
 * @param list Array of items to be converted into strings. Works best if these are simply strings
 *   to begin with.
 * @param conjunction Defaults to 'and'. The conjunction to be used before the final element.
 */
export function joinWithFinalConjunction(list: ReadonlyArray<any>, conjunction = 'and'): string {
    if (list.length < 2) {
        /**
         * If there are not multiple things in the list to join, just turn the list into a string
         * for an empty list, this will be '', for a single item list, this will just be the first
         * item as a string.
         */
        return list.join('');
    }

    /** When there are only two items in the list, we don't want any commas. */
    const commaSep = list.length > 2 ? ', ' : ' ';

    const commaJoined = list.slice(0, -1).join(commaSep);
    const fullyJoined = `${commaJoined}${commaSep}${conjunction} ${list[list.length - 1]}`;

    return fullyJoined;
}

export function removeAnsiEscapeCodes(input: string): string {
    return input.replace(ansiRegex, '');
}

export const removeColor = removeAnsiEscapeCodes;

export function removeCommasFromNumberString(numberString: string): string {
    return numberString.replace(/,/g, '');
}

/** Collapse all consecutive white space into just one space and trim surrounding whitespace. */
export function collapseWhiteSpace(input: string): string {
    return (
        input
            // sometimes \n isn't included in \s
            .replace(/\n/g, ' ')
            .trim()
            .replace(/\s{2,}/g, ' ')
    );
}

/** Same as String.prototype.split but includes the delimiter to split by in the output array. */
export function splitIncludeSplit(
    original: string,
    splitterInput: string | RegExp,
    caseSensitive: boolean,
) {
    const indexLengths = getAllIndexesOf({
        searchIn: original,
        searchFor: splitterInput,
        caseSensitive,
        includeLength: true,
    });

    const splitter = makeCaseInsensitiveRegExp(splitterInput, caseSensitive);

    const splits = original.split(splitter);

    const splitterIncluded = splits.reduce((accum: ReadonlyArray<string>, current, index) => {
        // this will be undefined on the last index
        const splitterLength: {index: number; length: number} | undefined = indexLengths[index];

        const includeCurrent = accum.concat(current);

        if (splitterLength) {
            const splitterMatch = original.slice(
                splitterLength.index,
                splitterLength.index + splitterLength.length,
            );

            return includeCurrent.concat(splitterMatch);
        } else {
            return includeCurrent;
        }
    }, []);

    return splitterIncluded;
}

export type CasingOptions = {
    capitalizeFirstLetter: boolean;
};

const defaultCasingOptions: Required<CasingOptions> = {
    capitalizeFirstLetter: false,
};

export function capitalizeFirstLetter<InputGeneric extends string>(
    input: InputGeneric,
): Capitalize<InputGeneric> {
    if (!input.length) {
        return '' as Capitalize<InputGeneric>;
    }
    const firstLetter: string = input[0]!;
    return (firstLetter.toUpperCase() + input.slice(1)) as Capitalize<InputGeneric>;
}

function maybeCapitalize(input: string, casingOptions: Partial<CasingOptions>): string {
    return casingOptions.capitalizeFirstLetter ? capitalizeFirstLetter(input) : input;
}

export function kebabCaseToCamelCase(
    rawKebabCase: string,
    casingOptions: Partial<CasingOptions> | undefined = defaultCasingOptions,
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

    return maybeCapitalize(camelCase, casingOptions);
}

function isLowerCase(input: string): boolean {
    // this excludes letters that are identical between lower and upper case like punctuation
    return input !== input.toUpperCase();
}

export function camelCaseToKebabCase(rawCamelCase: string) {
    const kebabCase: string = rawCamelCase
        .split('')
        .reduce((accum, currentLetter, index, originalString) => {
            const previousLetter = index > 0 ? originalString[index - 1]! : '';
            const nextLetter = index < originalString.length - 1 ? originalString[index + 1]! : '';
            const possibleWordBoundary = isLowerCase(previousLetter) || isLowerCase(nextLetter);

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

export function replaceStringAtIndex(
    originalString: string,
    start: number,
    newString: string,
    length = newString.length,
): string {
    const before = originalString.substring(0, start);
    const after = originalString.substring(start + length);

    return `${before}${newString}${after}`;
}

/**
 * Escapes characters from the given string so that it can be used within a RegExp without being
 * parsed as RegExp syntax.
 */
export function escapeStringForRegExp(input: string): string {
    return input.replace(/[\^$\\.*+?()[\]{}|]/g, '\\$&');
}

function makeCaseInsensitiveRegExp(searchForInput: string | RegExp, caseSensitive: boolean) {
    const regExpFlags: string = `g${
        !caseSensitive && typeof searchForInput === 'string' ? 'i' : ''
    }`;
    const searchFor: RegExp =
        searchForInput instanceof RegExp
            ? new RegExp(
                  searchForInput.source,
                  deDupeRegExFlags(`${searchForInput.flags}${regExpFlags}`),
              )
            : new RegExp(escapeStringForRegExp(searchForInput), regExpFlags);

    return searchFor;
}

export function getAllIndexesOf<IncludeLength extends boolean | undefined>({
    searchIn,
    searchFor,
    caseSensitive,
    includeLength,
}: {
    searchIn: string;
    searchFor: string | RegExp;
    /**
     * CaseSensitive only applies when the input is a string. Otherwise, the RegExp's "i" flag is
     * used to determine case sensitivity.
     */
    caseSensitive: boolean;
    includeLength?: IncludeLength;
}): IncludeLength extends true ? {index: number; length: number}[] : number[] {
    const searchRegExp: RegExp = makeCaseInsensitiveRegExp(searchFor, caseSensitive);

    const indexes: number[] = [];
    const indexesAndLengths: {
        index: number;
        length: number;
    }[] = [];

    searchIn.replace(
        searchRegExp,
        (...matchResults: ReadonlyArray<string | undefined | number>): string => {
            /**
             * Grabbing the second to last entry in the array (rather than the second) takes capture
             * groups into account.
             */
            const matchIndex: string | number | undefined = matchResults[matchResults.length - 2];

            // this is used as a type safety catch and cannot actually be triggered on purpose
            // istanbul ignore next
            if (typeof matchIndex !== 'number') {
                throw new Error(
                    `Match index "${matchIndex}" is not a number. Searching for "${searchFor}" in "${searchIn}".`,
                );
            }

            const regExpMatch: string | number | undefined = matchResults[0];

            // this is used as a type safety catch and cannot actually be triggered on purpose
            // istanbul ignore next
            if (typeof regExpMatch !== 'string') {
                throw new Error(
                    `regExpMatch should've been a string but was ${typeof regExpMatch}!`,
                );
            }

            indexesAndLengths.push({index: matchIndex, length: regExpMatch.length});
            indexes.push(matchIndex);

            const originalMatch = matchResults[0];

            // this is used as a type safety catch and cannot actually be triggered on purpose
            // istanbul ignore next
            if (typeof originalMatch !== 'string') {
                throw new Error(
                    `Original match when searching for "${searchFor}" in "${searchIn}" at index ${matchIndex} is not a string.`,
                );
            }
            /**
             * Don't actually change any text. What we do here doesn't matter because we're not
             * using the output of the .replace method, we're just producing side effects.
             */
            return originalMatch;
        },
    );

    return (includeLength ? indexesAndLengths : indexes) as IncludeLength extends true
        ? {index: number; length: number}[]
        : number[];
}

export function typedSplit(input: string, splitString: string): AtLeastTuple<string, 1> {
    return input.split(splitString) as unknown as AtLeastTuple<string, 1>;
}
