import {extendableAssertions, waitUntilOverrides} from '../../assertions/extendable-assertions.js';
import {createWaitUntilGroup, WaitUntilOptions} from '../../guard-types/wait-until-function.js';

/**
 * A group of guard methods that run the given callback multiple times until its return value
 * matches expectations. Callback interval and timeout can be customized with
 * {@link WaitUntilOptions}.
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
export const waitUntil = createWaitUntilGroup(extendableAssertions, waitUntilOverrides);
