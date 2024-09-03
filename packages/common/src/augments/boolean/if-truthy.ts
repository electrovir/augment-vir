import {check, type Falsy, type Truthy} from '@augment-vir/assert';

/**
 * Checks an input for truthiness then calls the respective callback, returning the callback's
 * output.
 *
 * @category Boolean : Common
 * @example
 *
 * ```ts
 * import {ifTruthy} from '@augment-vir/common';
 *
 * const result1 = ifTruthy(
 *     true,
 *     () => 1,
 *     () => 2,
 * ); // result1 is `1`
 * const result2 = ifTruthy(
 *     false,
 *     () => 1,
 *     () => 2,
 * ); // result2 is `2`
 * ```
 *
 * @returns The called callback's output.
 * @package @augment-vir/common
 */
export function ifTruthy<const InputType, IfTruthyType, IfFalsyType>(
    checkThis: InputType,
    ifTruthyCallback: (truthyInput: Truthy<InputType>) => IfTruthyType,
    ifFalsyCallback: (truthyInput: Falsy<InputType>) => IfFalsyType,
): IfTruthyType | IfFalsyType {
    if (check.isTruthy(checkThis)) {
        return ifTruthyCallback(checkThis);
    } else {
        return ifFalsyCallback(checkThis as Falsy<InputType>);
    }
}
