import {AnyObject} from '@augment-vir/common';

/**
 * Extracts all model names from the generated `Prisma` object.
 *
 * @example
 *     import type {Prisma} from '@prisma/client';
 *
 *     function doThing(modelName: ModelNameFromPrismaTypeMap<Prisma.TypeMap>) {}
 */
export type ModelNameFromPrismaTypeMap<PrismaTypeMap extends BasePrismaTypeMap> =
    PrismaTypeMap['meta']['modelProps'];

/**
 * Extracts all model names from the generated `PrismaClient`.
 *
 * @example
 *     import type {PrismaClient} from '@prisma/client';
 *
 *     function doThing(modelName: ModelNameFromPrismaClient<PrismaClient>) {}
 */
export type ModelNameFromPrismaClient<PrismaClient extends AnyObject> = keyof {
    [Model in Extract<keyof PrismaClient, string> as PrismaClient[Model] extends {
        findFirstOrThrow: Function;
    }
        ? Model
        : never]: boolean;
};

/**
 * Extracts the creation data for a model from the given `PrismaClient` type.
 *
 * @example
 *     import type {PrismaClient} from '@prisma/client';
 *
 *     function doThing(entry: ModelCreationEntry<PrismaClient, 'User'>) {}
 */
export type ModelCreationEntry<
    PrismaClient extends AnyObject,
    Model extends ModelNameFromPrismaClient<PrismaClient>,
> =
    NonNullable<Parameters<PrismaClient[Model]['create']>[0]> extends {data?: infer Data}
        ? NonNullable<Data>
        : `ERROR: failed to infer creation entry for model '${Model}'`;

/**
 * A base type for `Prisma.TypeMap` because Prisma doesn't give us one. This currently only includes
 * the properties that are used within `@augment-vir/prisma-node-js`.
 */
export type BasePrismaTypeMap = {
    meta: {
        modelProps: string;
    };
    model: Record<string, {payload: BasePrismaPayload}>;
};

/**
 * A base type for Prisma model payloads because Prisma doesn't give us one. This currently only
 * includes the properties that are used within `@augment-vir/prisma-node-js`.
 *
 * Note: this omits the `composites` property because I don't have any examples of what those
 * actually are.
 */
export type BasePrismaPayload = {
    name: string;
    objects: Record<string, BasePrismaPayload | BasePrismaPayload[] | null>;
    scalars: AnyObject;
};

/**
 * Given a model name from your Prisma schema, this creates a type with all of the model's relations
 * expanded into objects recursively.
 *
 * @example
 *     import type {Prisma} from '@prisma/client';
 *
 *     function doThing(fullModel: FullModel<Prisma.TypeMap, 'User'>) {}
 */
export type FullModel<
    PrismaTypeMap extends BasePrismaTypeMap,
    Model extends ModelNameFromPrismaTypeMap<PrismaTypeMap>,
> = ExpandPayload<PrismaTypeMap['model'][Model]['payload']>;

/** Expand a Prisma payload into its scalars and recursive relations. */
export type ExpandPayload<Payload extends BasePrismaPayload> = Payload['scalars'] & {
    [Key in keyof Payload['objects']]:
        | ExpandPotentialArrayPayload<NonNullable<Payload['objects'][Key]>>
        | (null extends Payload['objects'][Key] ? null : never);
};

/** Expand a payload that might be inside of an array, keeping it inside of an array if it is. */
export type ExpandPotentialArrayPayload<
    PayloadWrapper extends BasePrismaPayload | BasePrismaPayload[],
> = PayloadWrapper extends (infer ActualPayload extends BasePrismaPayload)[]
    ? ExpandPayload<ActualPayload>[]
    : PayloadWrapper extends BasePrismaPayload
      ? ExpandPayload<PayloadWrapper>
      : never;
