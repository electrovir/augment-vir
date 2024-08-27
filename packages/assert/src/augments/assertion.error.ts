import {combineErrorMessages} from '@augment-vir/core';

/**
 * An error thrown by the `@augment-vir/assert` package when an assertion fails.
 *
 * This requires both a `baseMessage` (the default "this thing failed" error message defined inside
 * `@augment-vir/assert` for each assert method), and a possibly-undefined `userCustomizedMessage`
 * (the optional user-defined failure message for any assertion).
 *
 * @category Assert : Util
 * @example
 *
 * ```ts
 * import {AssertionError} from '@augment-vir/assert';
 *
 * // the message from this error will be: `'User defined message: The assertion failed.'`
 * throw new AssertionError('The assertion failed.', 'User defined message.');
 * ```
 *
 * @package @augment-vir/assert
 */
export class AssertionError extends Error {
    public override name = 'AssertionError';
    constructor(baseMessage: string, userCustomizedMessage: string | undefined) {
        super(combineErrorMessages(userCustomizedMessage, baseMessage) || 'Assertion failed.');
    }
}
