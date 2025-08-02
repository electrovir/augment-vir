import {type BaseTypeMap} from './base-prisma-types.js';

/**
 * Extracts all model names from a generated `PrismaClient`.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {type PrismaClient} from '@prisma/client';
 * import {type PrismaModelName} from '@augment-vir/common';
 *
 * function doThing(modelName: PrismaModelName<PrismaClient>) {}
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaModelName<TypeMap extends BaseTypeMap> = Extract<keyof TypeMap['model'], string>;
