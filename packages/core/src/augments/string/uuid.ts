/**
 * Any of the UUID versions.
 *
 * @category String : Common
 * @category UUID : Common
 * @package @augment-vir/common
 */
export type Uuid = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Creates a cryptographically secure random v4 UUID using
 * [`crypto.randomUUID`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID).
 *
 * @category String : Common
 * @category UUID : Common
 * @package @augment-vir/common
 */
export function createUuidV4() {
    return crypto.randomUUID();
}
