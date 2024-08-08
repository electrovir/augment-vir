import {toEnsuredNumber} from '../number/number-conversion.js';

/**
 * Generic string type but with the given suffix appended to it.
 *
 * @category String
 */
export type WithSuffix<Suffix extends string> = `${string}${Suffix}`;

/**
 * Suffix for {@link addPercent} and {@link removePercent}.
 *
 * @category String
 */
export const percentSuffix = '%';

/**
 * Suffix for {@link addPx} and {@link removePx}.
 *
 * @category String
 */
export const pxSuffix = 'px';
/**
 * Generic string type but with the `'px'` suffix appended to it.
 *
 * @category String
 */
export type WithPx = WithSuffix<typeof pxSuffix>;
/**
 * Generic string type but with the `'%'` suffix appended to it.
 *
 * @category String
 */
export type WithPercent = WithSuffix<typeof percentSuffix>;

/**
 * Adds the `'px'` suffix to a string if it does not already exist.
 *
 * @category String
 */
export function addPx(input: number | string): WithPx {
    return addSuffix({value: input, suffix: pxSuffix});
}

/**
 * Removes the `'px'` suffix from a string if it exists.
 *
 * @category String
 * @throws `TypeError` if the input can't be converted into a number.
 */
export function removePx(input: string): number {
    return toEnsuredNumber(removeSuffix({value: input, suffix: pxSuffix}));
}

/**
 * Adds the `'%'` suffix to a string if it does not already exist.
 *
 * @category String
 */
export function addPercent(input: number | string): WithPercent {
    return addSuffix({value: input, suffix: percentSuffix});
}

/**
 * Removes the `'%'` suffix from a string if it exists.
 *
 * @category String
 * @throws `TypeError` if the input can't be converted into a number.
 */
export function removePercent(input: string): number {
    return toEnsuredNumber(removeSuffix({value: input, suffix: percentSuffix}));
}

/**
 * Adds a suffix to a string if it does not already exist.
 *
 * @category String
 */
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

/**
 * Removes a suffix from a string if it exists.
 *
 * @category String
 */
export function removeSuffix<const Suffix extends string>({
    value,
    suffix,
}: {
    value: string;
    suffix: Suffix;
}): string {
    if (value.endsWith(suffix)) {
        return value.slice(0, Math.max(0, value.length - suffix.length));
    } else {
        return value;
    }
}
