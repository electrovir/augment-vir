import {assert, check} from '@augment-vir/assert';
import {
    AnyObject,
    arrayToObject,
    awaitedForEach,
    BasePrismaClient,
    ensureErrorAndPrependMessage,
    filterMap,
    getObjectTypedEntries,
    getObjectTypedValues,
    mergeDefinedProperties,
    omitObjectKeys,
    PrismaAllModelsCreate,
    prismaModelCreateExclude,
    prismaModelCreateOmitId,
    type PartialWithUndefined,
    type PrismaAllBasicModels,
    type PrismaModelName,
} from '@augment-vir/common';
import type {IsAny} from 'type-fest';

/**
 * Params for {@link addData}. This is similar to {@link PrismaAllModelsCreate} but allows an array of
 * {@link PrismaAllModelsCreate} for sequential data creation.
 *
 * @category Prisma : Node
 * @category Package : @augment-vir/node
 * @example
 *
 * ```ts
 * import {PrismaAddModelData} from '@augment-vir/common';
 * import type {PrismaClient} from '@prisma/client';
 *
 * const mockData: PrismaAddModelData<PrismaClient> = [
 *     {
 *         user: {
 *             mockUser1: {
 *                 first_name: 'one',
 *                 id: 123,
 *                 // etc.
 *             },
 *             mockUser2: {
 *                 first_name: 'two',
 *                 id: 124,
 *                 authRole: 'user',
 *                 // etc.
 *             },
 *         },
 *     },
 *     {
 *         region: [
 *             {
 *                 id: 1,
 *                 name: 'North America',
 *                 // etc.
 *             },
 *             {
 *                 id: 2,
 *                 name: 'Europe',
 *                 // etc.
 *             },
 *         ],
 *     },
 * ];
 * ```
 *
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type PrismaAddDataData<PrismaClient extends BasePrismaClient> =
    | Readonly<PrismaAllModelsCreate<PrismaClient>>
    | ReadonlyArray<Readonly<PrismaAllModelsCreate<PrismaClient>>>;

export async function addData<const PrismaClient extends BasePrismaClient>(
    prismaClient: Readonly<PrismaClient>,
    data: IsAny<PrismaClient> extends true ? any : PrismaAddDataData<PrismaClient>,
): Promise<void> {
    const dataArray: Record<string, AnyObject>[] = (check.isArray(data) ? data : [data]) as Record<
        string,
        AnyObject
    >[];

    await awaitedForEach(dataArray, async (dataEntry) => {
        await addModelDataObject(prismaClient, dataEntry);
    });
}

async function addModelDataObject(
    prismaClient: Readonly<BasePrismaClient>,
    data: Record<string, AnyObject>,
) {
    /** Add the mock data to the mock prisma client. */
    await awaitedForEach(
        getObjectTypedEntries(data),
        async ([
            modelName,
            mockData,
        ]) => {
            /**
             * This type is dumbed down to just `AnyObject[]` because the union of all possible
             * model data is just way too big (and not helpful as the inputs to this function are
             * already type guarded).
             */
            const mockModelInstances: AnyObject[] = Array.isArray(mockData)
                ? mockData
                : getObjectTypedValues(mockData);

            const modelApi: AnyObject | undefined = prismaClient[modelName];

            assert.isDefined(modelApi, `No PrismaClient API found for model '${modelName}'`);

            try {
                const allData = filterMap(
                    mockModelInstances,
                    (entry) => {
                        return entry;
                    },
                    (mapped, modelEntry) => !modelEntry[prismaModelCreateExclude],
                );

                await awaitedForEach(allData, async (modelEntry) => {
                    if (modelEntry[prismaModelCreateOmitId]) {
                        modelEntry = omitObjectKeys<AnyObject, PropertyKey>(modelEntry, ['id']);
                    }

                    await modelApi.create({
                        data: modelEntry,
                    });
                });
            } catch (error) {
                throw ensureErrorAndPrependMessage(
                    error,
                    `Failed to create many '${modelName}' entries.\n\n${JSON.stringify(mockModelInstances, null, 4)}\n\n`,
                );
            }
        },
    );
}

const prismockKeys = [
    'getData',
    'setData',
];

export function getAllPrismaModelNames<const PrismaClient extends BasePrismaClient>(
    prismaClient: PrismaClient,
): PrismaModelName<PrismaClient>[] {
    return Object.keys(prismaClient)
        .filter(
            (key) => !key.startsWith('$') && !key.startsWith('_') && !prismockKeys.includes(key),
        )
        .sort() as PrismaModelName<PrismaClient>[];
}

/**
 * Options for `prisma.client.dumpData`.
 *
 * @category Prisma : Node
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type PrismaDataDumpOptions = {
    /**
     * The max number of entries to load per model. Set to `0` to remove this limit altogether
     * (which could be _very_ expensive for your database).
     *
     * @default 100
     */
    limit: number;
    /**
     * Strings to omit from the dumped data. For testability, omitting date or UUID id fields is a
     * common practice.
     */
    omitFields: string[];
};

const defaultPrismaDumpDataOptions: PrismaDataDumpOptions = {
    limit: 100,
    omitFields: [],
};

export async function dumpData<const PrismaClient extends BasePrismaClient>(
    prismaClient: PrismaClient,
    options: Readonly<PartialWithUndefined<PrismaDataDumpOptions>> = {},
): Promise<PrismaAllBasicModels<PrismaClient>> {
    const modelNames = getAllPrismaModelNames(prismaClient);
    const finalOptions = mergeDefinedProperties(defaultPrismaDumpDataOptions, options);

    const data: Partial<Record<PrismaModelName<PrismaClient>, AnyObject[]>> = await arrayToObject(
        modelNames,
        async (modelName) => {
            try {
                const entries: AnyObject[] = await prismaClient[modelName].findMany(
                    finalOptions.limit > 0
                        ? {
                              take: finalOptions.limit,
                          }
                        : {},
                );

                if (!entries.length) {
                    return undefined;
                }

                const filteredEntries = finalOptions.omitFields.length
                    ? entries.map((entry) => omitObjectKeys(entry, finalOptions.omitFields))
                    : entries;

                return {
                    key: modelName,
                    value: filteredEntries,
                };
            } catch (error) {
                throw ensureErrorAndPrependMessage(
                    error,
                    `Failed to read data for model '${modelName}'`,
                );
            }
        },
    );

    return data as PrismaAllBasicModels<PrismaClient>;
}
