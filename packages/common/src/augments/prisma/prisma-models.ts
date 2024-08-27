import type {AnyFunction, AnyObject} from '@augment-vir/core';

/**
 * Extracts all model names from a generated `Prisma` object.
 *
 * @example
 *
 * ```ts
 * import type {Prisma} from '@prisma/client';
 *
 * function doThing(modelName: ModelNameFromPrismaTypeMap<Prisma.TypeMap>) {}
 * ```
 */
export type ModelNameFromPrismaTypeMap<PrismaTypeMap extends BasePrismaTypeMap> =
    PrismaTypeMap['meta']['modelProps'];

/**
 * Extracts all model names from a generated `PrismaClient`.
 *
 * @example
 *
 * ```ts
 * import type {PrismaClient} from '@prisma/client';
 *
 * function doThing(modelName: ModelNameFromPrismaClient<PrismaClient>) {}
 * ```
 */
export type ModelNameFromPrismaClient<PrismaClient extends AnyObject> = keyof {
    [Model in Extract<keyof PrismaClient, string> as PrismaClient[Model] extends {
        findFirst: AnyFunction;
    }
        ? Model
        : never]: boolean;
};

/**
 * Extracts the creation data for a model from the given `PrismaClient` type.
 *
 * @example
 *
 * ```ts
 * import type {PrismaClient} from '@prisma/client';
 *
 * function doThing(entry: ModelCreationEntry<PrismaClient, 'User'>) {}
 * ```
 */
export type PrismaModelCreationEntry<
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
 * includes the properties that are used within this package.
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
 * A full model entry with all relations from the given Prisma type map and model name.
 *
 * @example
 *
 * ```ts
 * import type {Prisma} from '@prisma/client';
 *
 * function doThing(fullModel: FullModel<Prisma.TypeMap, 'User'>) {}
 * ```
 */
export type FullPrismaModel<
    PrismaTypeMap extends BasePrismaTypeMap,
    Model extends ModelNameFromPrismaTypeMap<PrismaTypeMap>,
> = ExpandPrismaTypeMapPayload<PrismaTypeMap['model'][Model]['payload']>;

/**
 * A base model entry with only its immediate properties from the given Prisma type map and model
 * name.
 *
 * @example
 *
 * ```ts
 * import type {Prisma} from '@prisma/client';
 *
 * function doThing(fullModel: BaseModel<Prisma.TypeMap, 'User'>) {}
 * ```
 */
export type BasePrismaModel<
    PrismaTypeMap extends BasePrismaTypeMap,
    Model extends ModelNameFromPrismaTypeMap<PrismaTypeMap>,
> = PrismaTypeMap['model'][Model]['payload']['scalars'];

/**
 * Expand a Prisma payload into its scalars and recursive relations.
 *
 * @category Internals
 */
export type ExpandPrismaTypeMapPayload<Payload extends BasePrismaPayload> = Payload['scalars'] & {
    [Key in keyof Payload['objects']]:
        | ExpandPotentialArrayPrismaTypeMapPayload<NonNullable<Payload['objects'][Key]>>
        | (null extends Payload['objects'][Key] ? null : never);
};

/**
 * Expand a payload that might be inside of an array, keeping it inside of an array if it is.
 *
 * @category Internals
 */
export type ExpandPotentialArrayPrismaTypeMapPayload<
    PayloadWrapper extends BasePrismaPayload | BasePrismaPayload[],
> = PayloadWrapper extends (infer ActualPayload extends BasePrismaPayload)[]
    ? ExpandPrismaTypeMapPayload<ActualPayload>[]
    : PayloadWrapper extends BasePrismaPayload
      ? ExpandPrismaTypeMapPayload<PayloadWrapper>
      : never;
