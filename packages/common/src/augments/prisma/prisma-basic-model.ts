import type {BasePrismaClient} from './base-prisma-types.js';
import type {PrismaModelName} from './prisma-model-name.js';

/**
 * A basic model entry with only its immediate properties.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import type {PrismaClient} from '@prisma/client';
 * import type {PrismaBasicModel} from '@augment-vir/common';
 *
 * function doThing(fullModel: PrismaBasicModel<PrismaClient, 'user'>) {}
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaBasicModel<
    PrismaClient extends BasePrismaClient,
    Model extends PrismaModelName<PrismaClient>,
> = PrismaClient['model'][Model]['payload']['scalars'];

/**
 * Basic model entries for all models in the database.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaAllBasicModels<PrismaClient extends BasePrismaClient> = Partial<{
    [ModelName in PrismaModelName<PrismaClient>]: PrismaBasicModel<PrismaClient, ModelName>[];
}>;
