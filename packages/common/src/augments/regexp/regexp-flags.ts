import {removeDuplicateCharacters} from '../string/remove-duplicate-characters.js';
import {escapeStringForRegExp} from './regexp-string.js';

/**
 * Creates a new RegExp by adding the given `flags` to the original RegExp.
 *
 * @category RegExp : Common
 * @example
 *
 * ```ts
 * import {addRegExpFlags} from '@augment-vir/common';
 *
 * addRegExpFlags(/a/i, 'gm');
 * // output is `/a/igm`
 * ```
 *
 * @package @augment-vir/common
 */
export function addRegExpFlags(originalRegExp: RegExp, flags: string): RegExp {
    return new RegExp(
        originalRegExp.source,
        removeDuplicateCharacters(
            [
                originalRegExp.flags,
                flags,
            ]
                .join('')
                .toLowerCase(),
        ),
    );
}

/**
 * Creates a new RegExp by adding or removing the case insensitivity flag `'i'`, based on the given
 * `caseSensitive` input. The first input can also be a string and it will be converted into a
 * RegExp.
 *
 * @category RegExp : Common
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
 * @package @augment-vir/common
 */
export function setRegExpCaseSensitivity(
    originalRegExpOrString: string | RegExp,
    {caseSensitive}: {caseSensitive: boolean},
) {
    const caseSensitivityFlag: string = caseSensitive ? '' : 'i';

    const newRegExp: RegExp =
        originalRegExpOrString instanceof RegExp
            ? new RegExp(
                  originalRegExpOrString.source,
                  removeDuplicateCharacters(
                      [
                          originalRegExpOrString.flags.replaceAll('i', ''),
                          caseSensitivityFlag,
                      ]
                          .join('')
                          .toLowerCase(),
                  ),
              )
            : new RegExp(escapeStringForRegExp(originalRegExpOrString), caseSensitivityFlag);

    return newRegExp;
}
