declare const tag: unique symbol;

/**
 * The container object that holds a {@link Tagged} type's tags.
 *
 * Copied from the `TagContainer` type in the `type-fest` package so that this package's public
 * types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type TagContainer<Token> = {
    readonly [tag]: Token;
};

type Tag<Token extends PropertyKey, TagMetadata> = TagContainer<{[K in Token]: TagMetadata}>;

/**
 * Create a tagged type that can support multiple tags and per-tag metadata. Useful for creating
 * distinct types that are not assignable to one another even though they share an underlying type.
 *
 * Copied from the `Tagged` type in the `type-fest` package so that this package's public types do
 * not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Tagged<Type, TagName extends PropertyKey, TagMetadata = never> = Type &
    Tag<TagName, TagMetadata>;
