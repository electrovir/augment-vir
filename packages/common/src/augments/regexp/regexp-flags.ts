import {removeDuplicateCharacters} from '../string/remove-duplicate-characters.js';
import {escapeStringForRegExp} from './regexp-string.js';

/**
 * Creates a new RegExp by adding the given `flags` to the original RegExp.
 *
 * @category RegExp
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {addRegExpFlags} from '@augment-vir/common';
 *
 * addRegExpFlags(/a/i, 'gm');
 * // output is `/a/igm`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function addRegExpFlags(originalRegExpOrString: RegExp | string, flags: string): RegExp {
    const allFlags = removeDuplicateCharacters(
        [
            typeof originalRegExpOrString === 'string' ? '' : originalRegExpOrString.flags,
            flags,
        ]
            .join('')
            .toLowerCase(),
    );

    return setRegExpFlags(originalRegExpOrString, allFlags);
}

/**
 * Creates a new RegExp with the given `flags`.
 *
 * @category RegExp
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {setRegExpFlags} from '@augment-vir/common';
 *
 * setRegExpFlags(/a/i, 'gm');
 * // output is `/a/gm`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function setRegExpFlags(originalRegExpOrString: RegExp | string, flags: string): RegExp {
    const allFlags = removeDuplicateCharacters(flags);

    if (typeof originalRegExpOrString === 'string') {
        return new RegExp(escapeStringForRegExp(originalRegExpOrString), allFlags);
    } else {
        return new RegExp(originalRegExpOrString.source, allFlags);
    }
}

/**
 * Creates a new RegExp by adding or removing the case insensitivity flag `'i'`, based on the given
 * `caseSensitive` input. The first input can also be a string and it will be converted into a
 * RegExp.
 *
 * @category RegExp
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {setRegExpCaseSensitivity} from '@augment-vir/common';
 *
 * setRegExpCaseSensitivity(/abc/i, {caseSensitive: true}); // output is `/abc/`
 * setRegExpCaseSensitivity(/abc/, {caseSensitive: false}); // output is `/abc/i`
 * setRegExpCaseSensitivity('abc', {caseSensitive: true}); // output is `/abc/i`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function setRegExpCaseSensitivity(
    originalRegExpOrString: string | RegExp,
    {caseSensitive}: {caseSensitive: boolean},
) {
    const caseSensitivityFlag: string = caseSensitive ? '' : 'i';

    return addRegExpFlags(originalRegExpOrString, caseSensitivityFlag);
}
