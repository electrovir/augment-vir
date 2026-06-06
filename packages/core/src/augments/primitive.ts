/**
 * Checks if the given value is a primitive or not. Does not type guard. For type guarding, use the
 * `check.isPrimitive` guard from `@augment-vir/assert`.
 *
 * @category Type
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function isPrimitive(this: void, value: unknown): boolean {
    /**
     * `null` is a primitive but `typeof null` gives `'object'` so we have to special case `null`
     * here.
     */
    return value === null || (typeof value !== 'object' && typeof value !== 'function');
}
