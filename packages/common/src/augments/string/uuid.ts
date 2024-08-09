/** @category String */
export type UuidV4 = ReturnType<typeof createUuid>;

/** Creates a cryptographically secure v4 UUID using `crypto.randomUUID`. */
export function createUuid() {
    return crypto.randomUUID();
}
