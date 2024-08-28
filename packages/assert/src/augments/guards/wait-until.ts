import {extendableAssertions, waitUntilOverrides} from '../../assertions/extendable-assertions.js';
import {
    createWaitUntil,
    createWaitUntilGroup,
    WaitUntilOptions,
} from '../../guard-types/wait-until-function.js';
import {AssertionError} from '../assertion.error.js';

const waitUntilGroup = createWaitUntilGroup(extendableAssertions, waitUntilOverrides);

/**
 * A group of guard methods that run the given callback multiple times until its return value
 * matches expectations. Callback interval and timeout can be customized with
 * {@link WaitUntilOptions}.
 *
 * This can also be called as a standalone wait until function which waits until the callback's
 * returned value is truthy.
 *
 * @category Assert
 * @example
 *
 * ```ts
 * import {waitUntil} from '@augment-vir/assert';
 *
 * // `result` will eventually be `'123'`
 * const result = await waitUntil.isString(
 *     () => {
 *         if (Math.random() < 0.5) {
 *             return 123;
 *         } else {
 *             return '123';
 *         }
 *     },
 *     {
 *         interval: {milliseconds: 100},
 *         timeout: {seconds: 10},
 *     },
 * );
 * ```
 *
 * @returns The successful callback return value.
 * @throws {@link AssertionError} When the assertion fails.
 * @package @augment-vir/assert
 */
export const waitUntil: ((
    callback: () => unknown,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
) => void) &
    typeof waitUntilGroup = Object.assign(
    createWaitUntil((input: unknown, failureMessage?: string | undefined) => {
        if (!input) {
            throw new AssertionError('Assertion failed.', failureMessage);
        }
    }),
    waitUntilGroup,
);
