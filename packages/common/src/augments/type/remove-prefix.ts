/**
 * Removes a prefix from a string type.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type RemovePrefix<Original extends string, Prefix extends string> = Prefix extends unknown
    ? Original extends `${Prefix}${infer Rest}`
        ? Rest
        : never
    : never;
