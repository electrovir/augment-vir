export type WithPrefix<Prefix extends string> = `${Prefix}${string}`;

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

export function removePrefix<const Prefix extends string>({
    value,
    prefix,
}: {
    value: WithPrefix<Prefix> | string;
    prefix: Prefix;
}): string {
    if (value.startsWith(prefix)) {
        return value.substring(prefix.length);
    } else {
        return value;
    }
}
