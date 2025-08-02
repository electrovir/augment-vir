import {type BaseTypeMap} from './base-prisma-types.js';
import {type PrismaBasicModel} from './prisma-basic-model.js';

/**
 * Gets the full model type with all nested models for Prisma.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaFullModel<
    TypeMap extends BaseTypeMap,
    Model extends keyof TypeMap['model'],
> = PrismaBasicModel<TypeMap, Model> &
    ExpandModelObjects<TypeMap['model'][Model]['payload']['objects'], TypeMap>;

/**
 * Expand a model's objects (nested models).
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ExpandModelObjects<Objects, TypeMap extends BaseTypeMap> = {
    [Key in keyof Objects]: Objects[Key] extends ReadonlyArray<infer Entry>
        ? ExpandModel<TypeMap, Entry>[]
        : ExpandModel<TypeMap, Objects[Key]>;
};

/**
 * Expand a model entry from {@link ExpandModelObjects}.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ExpandModel<TypeMap extends BaseTypeMap, Entry> =
    Entry extends Readonly<{name: infer ModelName extends keyof TypeMap['model']}>
        ? PrismaFullModel<TypeMap, ModelName>
        : never;
