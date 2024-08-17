import {makeCaseInsensitiveRegExp} from '../regexp/regexp-flags.js';

export function getSubstringIndexes<IncludeLength extends boolean | undefined>({
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
            /* node:coverage ignore next 5 */
            if (typeof matchIndex !== 'number') {
                throw new TypeError(
                    `Match index "${matchIndex}" is not a number. Searching for "${searchFor}" in "${searchIn}".`,
                );
            }

            const regExpMatch: string | number | undefined = matchResults[0];

            // this is used as a type safety catch and cannot actually be triggered on purpose
            /* node:coverage ignore next 5 */
            if (typeof regExpMatch !== 'string') {
                throw new TypeError(
                    `regExpMatch should've been a string but was ${typeof regExpMatch}!`,
                );
            }

            indexesAndLengths.push({index: matchIndex, length: regExpMatch.length});
            indexes.push(matchIndex);

            const originalMatch = matchResults[0];

            // this is used as a type safety catch and cannot actually be triggered on purpose
            /* node:coverage ignore next 5 */
            if (typeof originalMatch !== 'string') {
                throw new TypeError(
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
