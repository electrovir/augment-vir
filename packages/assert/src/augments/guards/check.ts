import type {AnyFunction} from '@augment-vir/core';
import {checkOverrides, extendableAssertions} from '../../assertions/extendable-assertions.js';
import {createCheckGroup} from '../../guard-types/check-function.js';

const checkGroup = createCheckGroup(extendableAssertions, checkOverrides);

/**
 * A group of guard methods that return a boolean type guard rather than an assertion type guard.
 *
 * This can also be called as a standalone check function which returns a boolean to indicate
 * whether its input is truthy or not.
 *
 * @category Assert
 * @category Package : @augment-vir/assert
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
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export const check: ((input: unknown) => boolean) &
    typeof checkGroup &
    Record<keyof AnyFunction, never> = Object.assign(function check(this: void, input: unknown) {
    return !!input;
}, checkGroup);
