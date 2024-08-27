/** @category String */
export type Uuid = `${string}-${string}-${string}-${string}-${string}`;

/** Creates a cryptographically secure random v4 UUID using `crypto.randomUUID`. */
export function createUuidV4() {
    return crypto.randomUUID();
}
