export type UuidV4 = ReturnType<typeof createUuid>;

const uuidRegExp = /[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/;

/** Checks if the input string is a valid v4 UUID. */
export function isUuid(maybeUuid: string): boolean {
    return !!maybeUuid.match(uuidRegExp);
}

/** Creates a cryptographically secure v4 UUID using `crypto.randomUUID`. */
export function createUuid() {
    return crypto.randomUUID();
}
