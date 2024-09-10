import {type BasePrismaClient, type BasePrismaPayload} from './base-prisma-types.js';
import type {PrismaModelName} from './prisma-model-name.js';

/**
 * A full model entry with all relations from the given Prisma type map and model name.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import type {Prisma} from '@prisma/client';
 * import type {FullPrismaModel} from '@augment-vir/common';
 *
 * function doThing(fullModel: FullModel<Prisma.TypeMap, 'User'>) {}
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaFullModel<
    PrismaClient extends BasePrismaClient,
    Model extends PrismaModelName<PrismaClient>,
> = ExpandPrismaTypeMapPayload<PrismaClient[Model][symbol]['types']['payload']>;

/**
 * Expand a Prisma payload into its scalars and recursive relations.
 *
 * @category Prisma : Common : Util
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ExpandPrismaTypeMapPayload<Payload extends BasePrismaPayload> = Payload['scalars'] & {
    [Key in keyof Payload['objects']]:
        | ExpandPotentialArrayPrismaTypeMapPayload<NonNullable<Payload['objects'][Key]>>
        | (null extends Payload['objects'][Key] ? null : never);
};

/**
 * Expand a payload that might be inside of an array, keeping it inside of an array if it is.
 *
 * @category Prisma : Common : Util
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ExpandPotentialArrayPrismaTypeMapPayload<
    PayloadWrapper extends BasePrismaPayload | BasePrismaPayload[],
> = PayloadWrapper extends (infer ActualPayload extends BasePrismaPayload)[]
    ? ExpandPrismaTypeMapPayload<ActualPayload>[]
    : PayloadWrapper extends BasePrismaPayload
      ? ExpandPrismaTypeMapPayload<PayloadWrapper>
      : never;
