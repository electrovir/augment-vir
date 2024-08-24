import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {readdir, rm} from 'node:fs/promises';
import {prisma} from '../augments/prisma.js';
import {
    testInvalidPrismaSchemaPath,
    testPrismaMigrationsDirPath,
    testPrismaSchema2Path,
    testPrismaSchemaPath,
} from '../file-paths.mock.js';
import {clearTestDatabaseOutputs} from './prisma-database.mock.js';
import {
    PrismaMigrationNeededError,
    PrismaResetNeededError,
    PrismaSchemaError,
} from './prisma-errors.js';

describe(prisma.migration.status.name, () => {
    it('fails without a database', async () => {
        await clearTestDatabaseOutputs();

        await assert.throws(prisma.migration.status(testPrismaSchemaPath), {
            matchMessage: 'does not exist at',
            matchConstructor: PrismaSchemaError,
        });
    });
    it('works', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);
        await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);

        const status = await prisma.migration.status(testPrismaSchemaPath);
        assert.strictEquals(status.totalMigrations, 1);
        assert.isLengthExactly(status.unappliedMigrations, 0);
    });
});

describe(prisma.migration.create.name, () => {
    it('creates an unapplied migration', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);
        assert.deepEquals(await prisma.migration.status(testPrismaSchemaPath), {
            totalMigrations: 0,
            unappliedMigrations: [],
        });

        await prisma.migration.create(
            {
                migrationName: 'init',
                createOnly: true,
            },
            testPrismaSchemaPath,
        );

        assert.isTrue(existsSync(testPrismaMigrationsDirPath));
        assert.isLengthExactly(await readdir(testPrismaMigrationsDirPath), 2);
        const status = await prisma.migration.status(testPrismaSchemaPath);
        assert.strictEquals(status.totalMigrations, 1);
        assert.isLengthExactly(status.unappliedMigrations, 1);
        assert.endsWith(status.unappliedMigrations[0], '_init');
    });

    it('creates and applies a migration', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);
        assert.deepEquals(await prisma.migration.status(testPrismaSchemaPath), {
            totalMigrations: 0,
            unappliedMigrations: [],
        });

        await prisma.migration.create(
            {
                migrationName: 'init',
            },
            testPrismaSchemaPath,
        );

        assert.isTrue(existsSync(testPrismaMigrationsDirPath));
        assert.isLengthExactly(await readdir(testPrismaMigrationsDirPath), 2);
        const status = await prisma.migration.status(testPrismaSchemaPath);
        assert.strictEquals(status.totalMigrations, 1);
        assert.isLengthExactly(status.unappliedMigrations, 0);
    });
    it('errors with invalid inputs', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);
        await assert.throws(
            prisma.migration.create({migrationName: "in' --boggle='it"}, testPrismaSchemaPath),
        );
    });
});

describe(prisma.migration.applyDev.name, () => {
    it('applies migrations', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);

        await prisma.migration.create(
            {
                migrationName: 'init',
                createOnly: true,
            },
            testPrismaSchemaPath,
        );

        assert.isTrue(existsSync(testPrismaMigrationsDirPath));
        assert.isLengthExactly(await readdir(testPrismaMigrationsDirPath), 2);
        const status = await prisma.migration.status(testPrismaSchemaPath);
        assert.strictEquals(status.totalMigrations, 1);
        assert.isLengthExactly(status.unappliedMigrations, 1);
        assert.endsWith(status.unappliedMigrations[0], '_init');

        await prisma.migration.applyDev(testPrismaSchemaPath);
        assert.deepEquals(await prisma.migration.status(testPrismaSchemaPath), {
            totalMigrations: 1,
            unappliedMigrations: [],
        });
    });
    it('fails on invalid schema', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);

        await prisma.migration.create(
            {
                migrationName: 'init',
                createOnly: true,
            },
            testPrismaSchemaPath,
        );

        assert.isTrue(existsSync(testPrismaMigrationsDirPath));
        assert.isLengthExactly(await readdir(testPrismaMigrationsDirPath), 2);
        const status = await prisma.migration.status(testPrismaSchemaPath);
        assert.strictEquals(status.totalMigrations, 1);
        assert.isLengthExactly(status.unappliedMigrations, 1);
        assert.endsWith(status.unappliedMigrations[0], '_init');

        await assert.throws(prisma.migration.applyDev(testInvalidPrismaSchemaPath), {
            matchConstructor: PrismaSchemaError,
            matchMessage: 'Invalid schema file',
        });
    });
    it('fails when a new migration is needed', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);

        await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);
        assert.deepEquals(await prisma.migration.status(testPrismaSchemaPath), {
            totalMigrations: 1,
            unappliedMigrations: [],
        });

        await assert.throws(prisma.migration.applyDev(testPrismaSchema2Path), {
            matchMessage: 'A new Prisma migration is needed for',
            matchConstructor: PrismaMigrationNeededError,
        });
    });
    it('fails when a reset is needed', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);

        await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);
        assert.deepEquals(await prisma.migration.status(testPrismaSchemaPath), {
            totalMigrations: 1,
            unappliedMigrations: [],
        });
        await rm(testPrismaMigrationsDirPath, {force: true, recursive: true});

        await assert.throws(prisma.migration.applyDev(testPrismaSchema2Path), {
            matchMessage: 'A database reset is needed for',
            matchConstructor: PrismaResetNeededError,
        });
    });
});

describe(prisma.migration.applyProd.name, () => {
    it('applies migrations', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);

        await prisma.migration.create(
            {
                migrationName: 'init',
                createOnly: true,
            },
            testPrismaSchemaPath,
        );

        assert.isTrue(existsSync(testPrismaMigrationsDirPath));
        assert.isLengthExactly(await readdir(testPrismaMigrationsDirPath), 2);
        const status = await prisma.migration.status(testPrismaSchemaPath);
        assert.strictEquals(status.totalMigrations, 1);
        assert.isLengthExactly(status.unappliedMigrations, 1);
        assert.endsWith(status.unappliedMigrations[0], '_init');

        await prisma.migration.applyProd(testPrismaSchemaPath);
        assert.deepEquals(await prisma.migration.status(testPrismaSchemaPath), {
            totalMigrations: 1,
            unappliedMigrations: [],
        });
    });
    it('ignores schema file changes', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);

        await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);
        assert.deepEquals(await prisma.migration.status(testPrismaSchemaPath), {
            totalMigrations: 1,
            unappliedMigrations: [],
        });

        await prisma.migration.applyProd(testPrismaSchema2Path);
    });
    it('ignores when a reset is needed', async () => {
        await clearTestDatabaseOutputs();
        await prisma.database.resetDev(testPrismaSchemaPath);

        await prisma.migration.create({migrationName: 'init'}, testPrismaSchemaPath);
        assert.deepEquals(await prisma.migration.status(testPrismaSchemaPath), {
            totalMigrations: 1,
            unappliedMigrations: [],
        });
        await rm(testPrismaMigrationsDirPath, {force: true, recursive: true});

        await prisma.migration.applyProd(testPrismaSchema2Path);
    });
});
