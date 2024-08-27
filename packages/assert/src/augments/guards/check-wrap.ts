import {checkWrapOverrides, extendableAssertions} from '../../assertions/extendable-assertions.js';
import {createCheckWrapGroup} from '../../guard-types/check-wrap-wrapper-function.js';
import type {assertWrap} from './assert-wrap.js';
import type {check} from './check.js';

/**
 * A group of guard methods that do the following:
 *
 * 1. Run the method's assertion on the given inputs.
 * 2. If the assertion fails, return `undefined`.
 * 3. If the assertion succeeds, the first input is returned and (when possible) type guarded.
 *
 * This is a combination of {@link assertWrap} and {@link check}.
 *
 * @category Assert
 * @example
 *
 * ```ts
 * import {checkWrap} from '@augment-vir/assert';
 *
 * // `result1` will be `['a']`
 * const result1 = checkWrap.deepEquals(['a'], ['a']);
 *
 * const value: unknown = 'some value' as unknown;
 * // `result2` will be `'some value'` and it will have the type of `string`
 * const result2 = checkWrap.isString(value);
 *
 * const value2: unknown = 'some value' as unknown;
 * // `result` will be `undefined`
 * const result3 = checkWrap.isNumber(value2);
 * ```
 *
 * @returns The original given value (type guarded when possible) or, if the expectation fails,
 *   `undefined`.
 * @package @augment-vir/assert
 */
export const checkWrap = createCheckWrapGroup(extendableAssertions, checkWrapOverrides);

/** Type of {@link checkWrap}. */
export type CheckWrap = typeof checkWrap;
