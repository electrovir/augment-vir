/**
 * Requires every part of an object, even the indexed keys. This is needed because
 * `Required<Partial<T>>` doesn't fully remove `| undefined` from indexed keys when the
 * `noUncheckedIndexedAccess` TSConfig compiler option is enabled.
 *
 * @category Object:Common
 */
export type CompleteRequire<Parent> = {
    [Prop in keyof Parent]-?: Parent extends Partial<Record<Prop, infer V>> ? V : never;
};
