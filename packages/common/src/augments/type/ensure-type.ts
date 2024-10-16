/**
 * This is a type helper that ensures the given input matches the given generic type. The generic is
 * setup in such a way that if it is omitted (which is typically allowed in TypeScript, resulting in
 * the generic being inferred from the inputs), there will actually be a type error. This forces
 * each usage of this function to explicitly specify the generic, thus giving us type safety for the
 * input.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function ensureType<ExpectedType = never>(
    input: NoInfer<ExpectedType>,
): NoInfer<ExpectedType> {
    return input;
}
