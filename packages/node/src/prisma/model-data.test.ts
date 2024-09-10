import {assert} from '@augment-vir/assert';
import {prismaModelCreateExclude, prismaModelCreateOmitId} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {prisma} from '../augments/prisma.js';
import {testPrismaSchemaPath} from '../file-paths.mock.js';
import {addData, dumpData, getAllPrismaModelNames, PrismaAddDataData} from './model-data.js';
import {clearTestDatabaseOutputs} from './prisma-database.mock.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: this might not be generated yet
import type {PrismaClient} from '../../node_modules/.prisma/index.js';

describe(
    [
        addData.name,
        dumpData.name,
    ].join(' and '),
    () => {
        async function setupPrismaClient() {
            await clearTestDatabaseOutputs();

            await prisma.client.generate(testPrismaSchemaPath);
            await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: this might not be generated yet
            const {PrismaClient} = await import('../../node_modules/.prisma/index.js');

            return new PrismaClient();
        }

        async function testData(data: PrismaAddDataData<PrismaClient>) {
            const prismaClient = await setupPrismaClient();

            await prisma.client.addData(prismaClient, data);

            return await prisma.client.dumpData(prismaClient, {
                omitFields: [
                    'createdAt',
                    'updatedAt',
                    'id',
                ],
            });
        }

        it('includes all fields by default', async () => {
            const prismaClient = await setupPrismaClient();

            await prisma.client.addData(prismaClient, {
                user: [
                    {
                        email: 'fake@example.com',
                        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                        password: 'fake password',
                    },
                ],
                region: {
                    region1: {
                        regionName: 'fake',
                    },
                },
            });

            assert.hasKeys((await prisma.client.dumpData(prismaClient)).user?.[0], [
                'createdAt',
                'email',
                'firstName',
                'id',
                'lastName',
                'password',
                'phoneNumber',
                'role',
                'updatedAt',
            ]);
        });

        it('dumps without limit', async () => {
            assert.isDefined(
                await prisma.client.dumpData(await setupPrismaClient(), {
                    limit: 0,
                }),
            );
        });

        it('adds without id', async () => {
            const prismaClient = await setupPrismaClient();

            await prisma.client.addData(prismaClient, {
                user: [
                    {
                        email: 'fake@example.com',
                        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                        password: 'fake password',
                        id: 'fake-id',
                    },
                ],
            });

            assert.deepEquals(
                await prismaClient.user.findMany({
                    select: {
                        id: true,
                    },
                }),
                [
                    {
                        id: 'fake-id',
                    },
                ],
            );

            await prisma.client.addData(prismaClient, {
                user: [
                    {
                        email: 'fake2@example.com',
                        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                        password: 'fake password 2',
                        id: 'fake-id-2',
                        [prismaModelCreateOmitId]: true,
                    },
                ],
            });

            assert.notStrictEquals(
                (
                    await prismaClient.user.findFirstOrThrow({
                        where: {
                            id: {
                                not: 'fake-id',
                            },
                        },
                        select: {
                            id: true,
                        },
                    })
                ).id,
                'fake-id-2',
            );
        });

        itCases(testData, [
            {
                it: 'adds a mix of keyed and array data',
                input: [
                    {
                        user: [
                            {
                                email: 'fake@example.com',
                                // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                                password: 'fake password',
                            },
                        ],
                        region: {
                            region1: {
                                regionName: 'fake',
                            },
                        },
                    },
                ],
                expect: {
                    region: [
                        {regionName: 'fake'},
                    ],
                    user: [
                        {
                            email: 'fake@example.com',
                            // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                            password: 'fake password',
                            firstName: null,
                            lastName: null,
                            role: null,
                            phoneNumber: null,
                        },
                    ],
                },
            },
            {
                it: 'adds keyed-only data',
                input: {
                    user: [
                        {
                            email: 'fake@example.com',
                            // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                            password: 'fake password',
                        },
                    ],
                    region: {
                        region1: {
                            regionName: 'fake',
                        },
                    },
                },

                expect: {
                    region: [
                        {regionName: 'fake'},
                    ],
                    user: [
                        {
                            email: 'fake@example.com',
                            // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                            password: 'fake password',
                            firstName: null,
                            lastName: null,
                            role: null,
                            phoneNumber: null,
                        },
                    ],
                },
            },
            {
                it: 'leaves out excluded entries',
                input: {
                    user: [
                        {
                            email: 'fake@example.com',
                            // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                            password: 'fake password',
                            [prismaModelCreateExclude]: true,
                        },
                        {
                            email: 'fake2@example.com',
                            // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                            password: 'fake password 2',
                        },
                    ],
                    region: [
                        {regionName: 'fake'},
                    ],
                },

                expect: {
                    region: [
                        {regionName: 'fake'},
                    ],
                    user: [
                        {
                            email: 'fake2@example.com',
                            // eslint-disable-next-line sonarjs/no-hardcoded-credentials
                            password: 'fake password 2',
                            firstName: null,
                            lastName: null,
                            role: null,
                            phoneNumber: null,
                        },
                    ],
                },
            },
            {
                it: 'fails with informative message',
                input: {
                    user: [
                        // @ts-expect-error: intentionally missing fields
                        {},
                    ],
                },
                throws: {
                    matchMessage: "Failed to create many 'user' entries",
                },
            },
        ]);
    },
);

describe(getAllPrismaModelNames.name, () => {
    it('works', async () => {
        await clearTestDatabaseOutputs();

        await prisma.client.generate(testPrismaSchemaPath);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: this might not be generated yet
        const {PrismaClient} = await import('../../node_modules/.prisma/index.js');

        const prismaClient = new PrismaClient();

        assert.deepEquals(prisma.client.listModelNames(prismaClient), [
            'region',
            'user',
            'userPost',
            'userSettings',
            'userStats',
        ]);
    });
});
