import {BasePrismaClient} from './base-prisma-types.js';

/**
 * Extracts all model names from a generated `PrismaClient`.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import type {PrismaClient} from '@prisma/client';
 * import type {PrismaModelName} from '@augment-vir/common';
 *
 * function doThing(modelName: PrismaModelName<PrismaClient>) {}
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaModelName<PrismaClient extends BasePrismaClient> = Exclude<
    keyof PrismaClient,
    `$${string}` | symbol
>;
