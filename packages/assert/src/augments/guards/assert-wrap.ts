import {assertWrapOverrides, extendableAssertions} from '../../assertions/extendable-assertions.js';
import {createAssertWrapGroup} from '../../guard-types/assert-wrap-function.js';

/**
 * A group of guard methods that do the following:
 *
 * 1. Run the method's assertion on the given inputs.
 * 2. If the assertion fails, throws an error.
 * 3. If the assertion succeeds, the first input is returned and (when possible) type guarded.
 *
 * @category Assert
 * @example
 *
 * ```ts
 * import {assertWrap} from '@augment-vir/assert';
 *
 * // `result1` will be `['a']`
 * const result1 = assertWrap.deepEquals(['a'], ['a']);
 *
 * const value: unknown = 'some value' as unknown;
 * // `result2` will be `'some value'` and it will have the type of `string`
 * const result2 = assertWrap.isString(value);
 *
 * const value2: unknown = 'some value' as unknown;
 * // this will throw an error
 * const result3 = assertWrap.isNumber(value2);
 * ```
 *
 * @returns The original value if expectations are met.
 * @throws {@link AssertionError} When the assertion fails.
 * @package @augment-vir/assert
 */
export const assertWrap = createAssertWrapGroup(extendableAssertions, assertWrapOverrides);
