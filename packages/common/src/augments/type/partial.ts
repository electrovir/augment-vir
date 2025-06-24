/**
 * Sets `T` as partial if `ShouldBePartial` is `true`. Otherwise, `T` is left alone.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type MakePartial<
    T extends object,
    ShouldBePartial extends boolean,
> = ShouldBePartial extends true ? Partial<T> : T;
