/**
 * Creates a function type in a single-method object so its parameter types are checked bivariant-ly
 * under `--strictFunctionTypes`. Method-syntax members are bivariant; bare function-typed
 * properties are contravariant. `Params` is a tuple so multiple parameters can be defined.
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type BivariantFunction<Params extends ReadonlyArray<unknown>, Return> = {
    callback(...params: Params): Return;
}['callback'];
