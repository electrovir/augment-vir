import {ansiRegex} from './ansi';
import {deDupeRegExFlags} from './regexp';

/**
 * Join elements into a string with commas separating each value. Add a conjunction before the final
 * item in the list. If the array has a length < 2, the conjunction is not added. If the list is
 * only of length 2, then no commas are added.
 *
 * @param list Array of items to be converted into strings. Works best if these are simply strings
 *   to begin with.
 * @param conjunction Defaults to 'and'. The conjunction to be used before the final element.
 */
export function joinWithFinalConjunction<T>(list: T[], conjunction = 'and'): string {
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

/**
 * Collapse all consecutive spaces into just one space and trim surrounding whitespace. Example:
 * "hello there" will turn into just "hello there".
 */
export function collapseSpaces(input: string): string {
    return input.trim().replace(/\s{2,}/g, ' ');
}

/** Same as String.prototype.split but includes the delimiter to split by in the output array. */
export function splitIncludeSplit(
    original: string,
    splitterInput: string | RegExp,
    caseSensitive: boolean,
) {
    const indexLengths = getAllIndexesOf(original, splitterInput, caseSensitive, true);

    const splitter = makeCaseInsensitiveRegExp(splitterInput, caseSensitive);

    const splits = original.split(splitter);

    const splitterIncluded = splits.reduce((accum: string[], current, index) => {
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

export function getAllIndexesOf(
    searchIn: string,
    searchForInput: string | RegExp,
    caseSensitive: boolean,
    includeLength: true,
): {index: number; length: number}[];
export function getAllIndexesOf(
    searchIn: string,
    searchForInput: string | RegExp,
    caseSensitive: boolean,
    includeLength?: false | undefined,
): number[];
export function getAllIndexesOf(
    searchIn: string,
    searchForInput: string | RegExp,
    /**
     * CaseSensitive only applies when the input is a string. Otherwise, the RegExp's "i" flag is
     * used to determine case sensitivity.
     */
    caseSensitive: boolean,
    includeLength = false,
): number[] | {index: number; length: number}[] {
    const searchFor: RegExp = makeCaseInsensitiveRegExp(searchForInput, caseSensitive);

    const indexes: number[] = [];
    const indexesAndLengths: {index: number; length: number}[] = [];

    searchIn.replace(searchFor, (...matchResults: (string | number)[]): string => {
        /**
         * Grabbing the second to last entry in the array (rather than the second) takes capture
         * groups into account.
         */
        const matchIndex: string | number | undefined = matchResults[matchResults.length - 2];

        if (typeof matchIndex !== 'number') {
            throw new Error(
                `Match index "${matchIndex}" is not a number. Searching for "${searchForInput}" in "${searchIn}".`,
            );
        }

        const regExpMatch: string | number | undefined = matchResults[0];

        if (typeof regExpMatch !== 'string') {
            throw new Error(`regExpMatch should've been a string but was ${typeof regExpMatch}!`);
        }

        indexesAndLengths.push({index: matchIndex, length: regExpMatch.length});
        indexes.push(matchIndex);

        const originalMatch = matchResults[0];

        if (typeof originalMatch !== 'string') {
            throw new Error(
                `Original match when searching for "${searchForInput}" in "${searchIn}" at index ${matchIndex} is not a string.`,
            );
        }
        /**
         * Don't actually change any text. What we do here doesn't matter because we're not using
         * the output of the .replace method, we're just producing side effects.
         */
        return originalMatch;
    });

    if (includeLength) {
        return indexesAndLengths;
    } else {
        return indexes;
    }
}

export function randomString(inputLength: number = 16): string {
    const arrayLength = Math.ceil(inputLength / 2);
    // server side
    if (typeof window === 'undefined') {
        throw new Error(
            `Window not defined for ${randomString.name} function. If using this in a Node.js context, import ${randomString.name} from 'augment-vir/dist/node'`,
        );
    }
    // browser side
    else {
        const uintArray = new Uint8Array(arrayLength);
        window.crypto.getRandomValues(uintArray);
        return (
            Array.from(uintArray)
                .map((value) => value.toString(16).padStart(2, '0'))
                .join('')
                /**
                 * Because getRandomValues works with even numbers only, we must then chop off extra
                 * characters if they exist in the even that inputLength was odd.
                 */
                .substring(0, inputLength)
        );
    }
}
