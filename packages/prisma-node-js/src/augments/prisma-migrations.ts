import {askQuestion, log, runShellCommand} from '@augment-vir/node-js';
import {PrismaDatabase} from './prisma-database';

export async function isDatabaseMigrationIsUpToDate(database: PrismaDatabase): Promise<boolean> {
    const output = await runShellCommand(
        `prisma migrate status --schema ${database.schemaFilePath}`,
        {
            cwd: database.cwd,
            env: {
                ...process.env,
                ...database.env,
            },
        },
    );

    return output.exitCode === 0;
}

export async function applyDatabaseMigrations(database: PrismaDatabase): Promise<void> {
    log.mutate(`Applying prisma migrations for "${database.databaseName}"...`);

    await runShellCommand(`prisma migrate deploy --schema ${database.schemaFilePath}`, {
        rejectOnError: true,

        cwd: database.cwd,
        env: {
            ...process.env,
            ...database.env,
        },
    });
}

export async function isANewMigrationNeeded(database: PrismaDatabase): Promise<boolean> {
    const results = await runShellCommand(
        `prisma migrate diff --from-schema-datamodel='${database.schemaFilePath}' --to-schema-datasource='${database.schemaFilePath}' --exit-code`,
        {
            cwd: database.cwd,
            env: {
                ...process.env,
                ...database.env,
            },
        },
    );

    if (results.exitCode === 1) {
        throw new Error(
            `Error running migrate diff for "${database.databaseName}": ${results.stderr}`,
        );
    }

    return results.exitCode === 2;
}

export async function ensurePrismaMigrationsAreUptoDate(database: PrismaDatabase) {
    const isUpToDate = await isDatabaseMigrationIsUpToDate(database);

    if (!isUpToDate) {
        await applyDatabaseMigrations(database);
    }
}

export async function createNewMigration({
    allowReset,
    database,
    isProd,
}: {
    allowReset: boolean;
    isProd: boolean;
    database: PrismaDatabase;
}) {
    log.info(
        `Changes detected in the prisma schema for database "${database.databaseName}". Creating a new migration now...`,
    );
    const migrationName = await askQuestion('Enter a name for your new migration:');

    const outputs = await runShellCommand(
        `prisma migrate dev --name='${migrationName}' --schema='${database.schemaFilePath}'`,
        {
            cwd: database.cwd,
            env: {
                ...process.env,
                ...database.env,
            },
        },
    );
    if (outputs.exitCode === 0) {
        log.mutate(
            `Created new migration with name "${migrationName}" in the "${database.databaseName}" database.`,
        );
    } else {
        log.error(
            `Error encountered while running "prisma migrate dev" in the "${database.databaseName}" database.\nAssuming we need to reset the database...`,
        );
        if (!allowReset) {
            throw new Error(`Reset blocked by "allowReset" input.`);
        }
        if (isProd) {
            throw new Error(`Resets are not allowed in prod.`);
        }

        log.info(`Resetting the "${database.databaseName}" database...`);
        await runShellCommand(
            `prisma migrate reset --force --schema='${database.schemaFilePath}'`,
            {
                cwd: database.cwd,
                env: {
                    ...process.env,
                    ...database.env,
                },
            },
        );
        log.mutate(`"${database.databaseName}" database has been reset.`);
    }
}
