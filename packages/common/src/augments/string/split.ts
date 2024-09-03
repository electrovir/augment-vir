import type {AtLeastTuple} from '@augment-vir/core';
import {setRegExpCaseSensitivity} from '../regexp/regexp-flags.js';
import {findSubstringIndexes} from './substring-index.js';

/**
 * Same as *
 * [`''.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
 * but includes the split delimiter in the output array.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {splitIncludeSplit} from '@augment-vir/common';
 *
 * splitIncludeSplit('1,2,3', ',', {caseSensitive: false}); // outputs `['1', ',', '2', ',', '3']`
 * ```
 *
 * @package @augment-vir/common
 */
export function splitIncludeSplit(
    original: string,
    splitDelimiter: string | RegExp,
    {caseSensitive}: {caseSensitive: boolean},
) {
    const indexLengths = findSubstringIndexes({
        searchIn: original,
        searchFor: splitDelimiter,
        caseSensitive,
        includeLength: true,
    });

    const splitter = setRegExpCaseSensitivity(splitDelimiter, {caseSensitive});

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

/**
 * Same as
 * [`''.split'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
 * but typed better: it always returns an array with at least one string.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export function safeSplit(input: string, splitString: string): AtLeastTuple<string, 1> {
    return input.split(splitString) as unknown as AtLeastTuple<string, 1>;
}
