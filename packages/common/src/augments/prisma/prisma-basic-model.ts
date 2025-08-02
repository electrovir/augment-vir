import {type BaseTypeMap} from './base-prisma-types.js';

/**
 * A basic model entry with only its immediate properties.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {type PrismaClient} from '@prisma/client';
 * import {type PrismaBasicModel} from '@augment-vir/common';
 *
 * function doThing(fullModel: PrismaBasicModel<PrismaClient, 'user'>) {}
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaBasicModel<
    TypeMap extends BaseTypeMap,
    Model extends keyof TypeMap['model'],
> = TypeMap['model'][Model]['payload']['scalars'];

/**
 * Basic model entries for all models in the database.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaAllBasicModels<TypeMap extends BaseTypeMap> = {
    [ModelName in keyof TypeMap['model']]: PrismaBasicModel<TypeMap, ModelName>;
};
