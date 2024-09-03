import {check} from '@augment-vir/assert';
import {extractErrorMessage} from '@augment-vir/core';

/**
 * Combines an array of errors into a single array.
 *
 * - If no errors are in the given array, a new Error with an empty message is returned.
 * - If only one error is in the given array, it is directly returned without modification.
 *
 * @category Array
 * @category Error
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {combineErrors} from '@augment-vir/common';
 *
 * const result1 = combineErrors([
 *     new Error('message 1'),
 *     new Error('message 2'),
 * ]); // result1 is a single error with the message 'message 1\nmessage 2'
 * ```
 *
 * @returns A single error.
 * @package @augment-vir/common
 */
export function combineErrors(errors: ReadonlyArray<Error>): Error {
    if (!check.isLengthAtLeast(errors, 1)) {
        return new Error();
    } else if (errors.length === 1) {
        return errors[0];
    }

    return new Error(errors.map((error) => extractErrorMessage(error).trim()).join('\n'));
}
