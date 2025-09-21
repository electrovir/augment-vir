/* eslint-disable @typescript-eslint/no-deprecated */

import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {prisma} from '../augments/prisma.js';
import {testPrismaSchema2Path, testPrismaSchemaPath} from '../file-paths.mock.js';
import {clearTestDatabaseOutputs} from './prisma-database.mock.js';

describe(prisma.database.hasDiff.name, () => {
    it('has diff after a db reset', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath, {withMigrations: true});

        assert.isTrue(await prisma.database.hasDiff(testPrismaSchemaPath));
    });
    it('has no diff after migrate', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath, {withMigrations: true});
        await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);

        assert.isFalse(await prisma.database.hasDiff(testPrismaSchemaPath));
    });
    it('resets a database', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath, {withMigrations: false});
    });
    it('has diff from other schema file', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath, {withMigrations: true});
        await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);

        assert.isTrue(await prisma.database.hasDiff(testPrismaSchema2Path));
    });
});
