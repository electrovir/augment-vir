import {toEnsuredNumber} from '../common-number';

export type WithSuffix<Suffix extends string> = `${string}${Suffix}`;

export const percentSuffix = '%' as const;
export const pxSuffix = 'px' as const;
export type WithPx = WithSuffix<typeof pxSuffix>;
export type WithPercent = WithSuffix<typeof percentSuffix>;

export function addPx(input: number | string): WithPx {
    return addSuffix({value: input, suffix: pxSuffix});
}

export function removePx(input: string): number {
    return toEnsuredNumber(removeSuffix({value: input, suffix: pxSuffix}));
}

export function addPercent(input: number | string): WithPercent {
    return addSuffix({value: input, suffix: percentSuffix});
}

export function removePercent(input: string): number {
    return toEnsuredNumber(removeSuffix({value: input, suffix: percentSuffix}));
}

export function addSuffix<const Suffix extends string>({
    value,
    suffix,
}: {
    value: unknown;
    suffix: Suffix;
}): WithSuffix<Suffix> {
    if (String(value).endsWith(suffix)) {
        return String(value) as WithSuffix<Suffix>;
    } else {
        return `${String(value)}${suffix}`;
    }
}

export function removeSuffix<const Suffix extends string>({
    value,
    suffix,
}: {
    value: WithSuffix<Suffix> | string;
    suffix: Suffix;
}): string {
    if (value.endsWith(suffix)) {
        return value.substring(0, value.length - suffix.length);
    } else {
        return value;
    }
}
