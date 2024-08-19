import type {AtLeastTuple} from '@augment-vir/core';
import {makeCaseInsensitiveRegExp} from '../regexp/regexp-flags.js';
import {getSubstringIndexes} from './substring-index.js';

/** Same as String.prototype.split but includes the delimiter to split by in the output array. */
export function splitIncludeSplit(
    original: string,
    splitterInput: string | RegExp,
    caseSensitive: boolean,
) {
    const indexLengths = getSubstringIndexes({
        searchIn: original,
        searchFor: splitterInput,
        caseSensitive,
        includeLength: true,
    });

    const splitter = makeCaseInsensitiveRegExp(splitterInput, caseSensitive);

    const splits = original.split(splitter);

    return splits.reduce((accum: ReadonlyArray<string>, current, index) => {
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
}

export function safeSplit(input: string, splitString: string): AtLeastTuple<string, 1> {
    return input.split(splitString) as unknown as AtLeastTuple<string, 1>;
}
