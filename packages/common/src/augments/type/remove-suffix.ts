/**
 * Removes a tuple of suffixes from a string. Note that the suffix removal happens in order, so
 * place your longest suffixes first.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RemoveSuffix<
    Original extends string,
    Suffixes extends readonly string[],
> = Suffixes extends readonly [
    infer First extends string,
    ...infer Rest extends string[],
]
    ? Original extends `${infer Prefix}-${First}`
        ? Prefix
        : RemoveSuffix<Original, Rest>
    : Original;
