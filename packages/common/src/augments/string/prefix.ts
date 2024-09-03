/**
 * Generic string type but with the given prefix prepended to it.
 *
 * @category String : Common
 * @package @augment-vir/common
 */
export type WithPrefix<Prefix extends string> = `${Prefix}${string}`;

/**
 * Adds a prefix to a string if it does not already exist.
 *
 * @category String : Common
 * @package @augment-vir/common
 */
export function addPrefix<const Prefix extends string>({
    value,
    prefix,
}: {
    value: unknown;
    prefix: Prefix;
}): WithPrefix<Prefix> {
    if (String(value).startsWith(prefix)) {
        return String(value) as WithPrefix<Prefix>;
    } else {
        return `${prefix}${String(value)}`;
    }
}

/**
 * Removes a prefix from a string if it exists.
 *
 * @category String : Common
 * @package @augment-vir/common
 */
export function removePrefix<const Prefix extends string>({
    value,
    prefix,
}: {
    value: string;
    prefix: Prefix;
}): string {
    if (value.startsWith(prefix)) {
        return value.slice(prefix.length);
    } else {
        return value;
    }
}
