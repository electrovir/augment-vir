import {AnyObject} from '@augment-vir/common';
import {EmptyObject} from 'type-fest';

/** Extracts all model names from the given Prisma client. */
export type ModelName<PrismaClient extends AnyObject> = keyof {
    [Model in Extract<keyof PrismaClient, string> as PrismaClient[Model] extends {
        findFirstOrThrow: Function;
    }
        ? Model
        : never]: boolean;
};

/** Extracts the creation data for a model from the given Prisma client. */
export type ModelCreationEntry<
    PrismaClient extends AnyObject,
    Model extends ModelName<PrismaClient>,
> =
    NonNullable<Parameters<PrismaClient[Model]['create']>[0]> extends {data?: infer Data}
        ? NonNullable<Data>
        : `ERROR: failed to infer creation entry for model '${Model}'`;

/** For a given model, extract all the available "include" properties and set them all to true. */
export type IncludeAll<PrismaClient extends AnyObject, Model extends ModelName<PrismaClient>> =
    NonNullable<NonNullable<Parameters<PrismaClient[Model]['findFirstOrThrow']>[0]>> extends {
        include?: infer IncludeArg;
    }
        ? Record<Exclude<keyof NonNullable<IncludeArg>, '_count'>, true>
        : EmptyObject;

export type BaseModel<
    PrismaClient extends AnyObject,
    Model extends ModelName<PrismaClient>,
> = NonNullable<Awaited<ReturnType<PrismaClient[Model]['findFirstOrThrow']>>>;

export type JoinedModel<PrismaClient extends AnyObject, Model extends ModelName<PrismaClient>> = {
    [FieldName in Extract<keyof IncludeAll<PrismaClient, Model>, string>]: Omit<
        ReturnType<PrismaClient[Model]['findFirstOrThrow']>,
        'then' | 'catch' | 'finally'
    > extends Record<FieldName, () => Promise<infer Result>>
        ? Result
        : `Error: failed to find relation for ${FieldName}`;
};

export type FullModel<
    PrismaClient extends AnyObject,
    Model extends ModelName<PrismaClient>,
> = JoinedModel<PrismaClient, Model> & BaseModel<PrismaClient, Model>;
