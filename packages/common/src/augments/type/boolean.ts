/**
 * Reverses a boolean (optionally `undefined`). `true` becomes `false`. `false` and `undefined`
 * become `true`.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type InverseBoolean<Input extends boolean | undefined> = Input extends true ? false : true;
