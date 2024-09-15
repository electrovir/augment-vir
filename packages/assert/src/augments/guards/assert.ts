import {tsTypeGuards} from '../../assertions/equality/ts-type-equality.js';
import {extendableAssertions} from '../../assertions/extendable-assertions.js';
import {AssertionError} from '../assertion.error.js';

const extraAssertions = {
    /**
     * Immediately throw an assertion error.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.fail(); // throws an `AssertionError`
     * ```
     *
     * @throws {@link AssertionError}
     */
    fail: (failureMessage?: string | undefined) => {
        throw new AssertionError('Failure triggered.', failureMessage);
    },
};

const allAssertions: typeof tsTypeGuards.assert &
    typeof extendableAssertions &
    typeof extraAssertions = {
    ...tsTypeGuards.assert,
    ...extendableAssertions,
    ...extraAssertions,
};

/**
 * A group of guard methods that assert their conditions and do nothing else.
 *
 * This can also be called as a standalone assertion function which asserts that its input is
 * truthy.
 *
 * @category Assert
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import {assert} from '@augment-vir/assert';
 *
 * const value: unknown = 'some value' as unknown;
 * assert.isString(value);
 * // `value` will now be typed as a `string`
 * ```
 *
 * @throws {@link AssertionError} When the assertion fails.
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export const assert: ((input: unknown, failureMessage?: string | undefined) => void) &
    typeof allAssertions = Object.assign(function assert(
    this: void,
    input: unknown,
    failureMessage?: string | undefined,
) {
    if (!input) {
        throw new AssertionError('Assertion failed.', failureMessage);
    }
}, allAssertions);
