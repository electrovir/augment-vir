/**
 * All standardized HTTP methods.
 *
 * @category HTTP
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 * @see https://developer.mozilla.org/docs/Web/HTTP/Methods
 */
export const HttpMethod = {
    Get: 'GET',
    Head: 'HEAD',
    Options: 'OPTIONS',
    Trace: 'TRACE',
    Put: 'PUT',
    Delete: 'DELETE',
    Post: 'POST',
    Patch: 'PATCH',
    Connect: 'CONNECT',
} as const;
/**
 * All standardized HTTP methods.
 *
 * @category HTTP
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 * @see https://developer.mozilla.org/docs/Web/HTTP/Methods
 */
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
