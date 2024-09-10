import type {BasePrismaClient} from './base-prisma-types.js';
import type {PrismaModelName} from './prisma-model-name.js';

/**
 * Use this to define mock entries that _shouldn't_ be saved to the database so that we can easily
 * write tests for missing data.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import type {PrismaClient} from '@prisma/client';
 * import {prismaModelCreateExclude, PrismaKeyedModelCreate} from '@augment-vir/common';
 *
 * export const mockUsers = {
 *     user1: {
 *         id: 1,
 *         authRole: 'admin',
 *     },
 *     missingUser: {
 *         id: -1,
 *         authRole: 'user',
 *         [prismaModelCreateExclude]: true,
 *     },
 * } as const satisfies PrismaKeyedModelCreate<PrismaClient, 'User'>;
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const prismaModelCreateExclude = Symbol('prisma-model-create-exclude');

/**
 * Use this to prevent the id property from being included when creating a mock record, allowing the
 * database's internal auto-increment functionality to generate one. This is necessary when testing
 * creation of new records because manually specified ids do not increment the auto incrementor.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import type {PrismaClient} from '@prisma/client';
 * import {prismaModelCreateOmitId, PrismaKeyedModelCreate} from '@augment-vir/common';
 *
 * export const mockUsers = {
 *     user1: {
 *         id: 1,
 *         authRole: 'admin',
 *         [prismaModelCreateOmitId]: true,
 *     },
 *     user2: {
 *         id: 2,
 *         authRole: 'admin',
 *         [prismaModelCreateOmitId]: true,
 *     },
 * } as const satisfies PrismaKeyedModelCreate<PrismaClient, 'User'>;
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const prismaModelCreateOmitId = Symbol('prisma-model-create-exclude-id');

/**
 * Extracts the creation data for a model from the given `PrismaClient` type.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import type {PrismaClient} from '@prisma/client';
 * import type {PrismaModelCreate} from '@augment-vir/common';
 *
 * function doThing(entry: PrismaModelCreate<PrismaClient, 'User'>) {}
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaModelCreate<
    PrismaClient extends BasePrismaClient,
    Model extends PrismaModelName<PrismaClient>,
> =
    NonNullable<Parameters<PrismaClient[Model]['create']>[0]> extends {data?: infer Data}
        ? NonNullable<Data> &
              Partial<{
                  [prismaModelCreateExclude]: true;
                  [prismaModelCreateOmitId]: true;
              }>
        : `ERROR: failed to infer creation entry for model '${Model}'`;

/**
 * A type for creating multiple Prisma create mocks that are named for future reference.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {PrismaKeyedModelCreate} from '@augment-vir/common';
 * import type {PrismaClient} from '@prisma/client';
 *
 * const mockUsers = {
 *     mockUser1: {
 *         first_name: 'one',
 *         id: 123,
 *         // etc.
 *     },
 *     mockUser2: {
 *         first_name: 'two',
 *         id: 124,
 *         auth_role: 'user',
 *         // etc.
 *     },
 * } as const satisfies PrismaKeyedModelCreate<PrismaClient, 'User'>;
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaKeyedModelCreate<
    PrismaClient extends BasePrismaClient,
    Model extends PrismaModelName<PrismaClient>,
> = {
    /** `EntryName` is for naming mocks. It doesn't correspond to model names or their field names. */
    [EntryName in string]: PrismaModelCreate<PrismaClient, Model>;
};

/**
 * Model create data stored by model name in either array or keyed form. Used in
 * `prisma.client.addData()` from `@augment-vir/node`.
 *
 * @category Prisma : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {PrismaKeyedModelCreate} from '@augment-vir/common';
 * import type {PrismaClient} from '@prisma/client';
 *
 * const mockData: ModelCreateData<PrismaClient> = {
 *     user: {
 *         mockUser1: {
 *             first_name: 'one',
 *             id: 123,
 *             // etc.
 *         },
 *         mockUser2: {
 *             first_name: 'two',
 *             id: 124,
 *             auth_role: 'user',
 *             // etc.
 *         },
 *     },
 *     region: [
 *         {
 *             id: 1,
 *             name: 'North America',
 *             // etc.
 *         },
 *         {
 *             id: 2,
 *             name: 'Europe',
 *             // etc.
 *         },
 *     ],
 * };
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PrismaAllModelsCreate<PrismaClient extends BasePrismaClient> = Readonly<
    Partial<{
        [Model in PrismaModelName<PrismaClient>]:
            | Readonly<PrismaKeyedModelCreate<PrismaClient, Model>>
            | ReadonlyArray<Readonly<PrismaModelCreate<PrismaClient, Model>>>;
    }>
>;
