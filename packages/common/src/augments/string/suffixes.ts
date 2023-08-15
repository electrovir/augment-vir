import {toEnsuredNumber} from '../number';

export type WithSuffix<Suffix extends string> = `${string}${Suffix}`;

export const percentSuffix = '%' as const;
export const pxSuffix = 'px' as const;
export type WithPx = WithSuffix<typeof pxSuffix>;
export type WithPercent = WithSuffix<typeof percentSuffix>;

export function addPx(input: number | string): WithPx {
    return addSuffix(input, pxSuffix);
}

export function removePx(input: string): number {
    return toEnsuredNumber(input.replace(/px$/, ''));
}

export function addPercent(input: number | string): WithPercent {
    return addSuffix(input, percentSuffix);
}

export function removePercent(input: string): number {
    return toEnsuredNumber(removeSuffix(input, percentSuffix));
}

export function addSuffix<const Suffix extends string>(
    input: unknown,
    suffix: Suffix,
): WithSuffix<Suffix> {
    if (String(input).endsWith(suffix)) {
        return String(input) as WithSuffix<Suffix>;
    } else {
        return `${String(input)}${suffix}`;
    }
}

export function removeSuffix<const Suffix extends string>(
    input: WithSuffix<Suffix> | string,
    suffix: Suffix,
): string {
    if (input.endsWith(suffix)) {
        return input.substring(0, input.length - suffix.length);
    } else {
        return input;
    }
}
