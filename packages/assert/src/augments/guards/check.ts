import {checkOverrides, extendableAssertions} from '../../assertions/extendable-assertions.js';
import {createCheckGroup} from '../../guard-types/check-function.js';

/**
 * A group of guard methods that return a boolean type guard rather than an assertion type guard.
 *
 * @category Assert
 * @example
 *
 * ```ts
 * import {check} from '@augment-vir/assert';
 *
 * const value: unknown = 'some value' as unknown;
 * if (check.isString(value)) {
 *     // `value` will now be typed as a `string` in here
 * }
 * ```
 *
 * @returns A boolean (as a type guard when possible).
 * @package @augment-vir/assert
 */
export const check = createCheckGroup(extendableAssertions, checkOverrides);
