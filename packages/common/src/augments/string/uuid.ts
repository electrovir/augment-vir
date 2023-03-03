const uuidRegExp = /[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/;

export function isUuid(maybeUuid: string): boolean {
    return !!maybeUuid.match(uuidRegExp);
}
