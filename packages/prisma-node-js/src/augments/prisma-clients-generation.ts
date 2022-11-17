import {log, readFileIfExists, runShellCommand} from '@augment-vir/node-js';
import {join} from 'path';
import {PrismaDatabase} from './prisma-database';
import {createNewMigration, isANewMigrationNeeded} from './prisma-migrations';

export async function areSchemasEqual(schemaAPath: string, schemaBPath: string): Promise<boolean> {
    const schemaAContents: string | undefined = await readFileIfExists(schemaAPath);
    const schemaBContents: string | undefined = await readFileIfExists(schemaBPath);

    if (schemaAContents == undefined || schemaBContents == undefined) {
        return false;
    }

    return schemaAContents === schemaBContents;
}

export async function isGeneratedDatabaseClientUpToDate(
    database: PrismaDatabase,
): Promise<boolean> {
    const areUpToDate = await areSchemasEqual(
        database.schemaFilePath,
        join(database.generatedPrismaClientDirPath, 'schema.prisma'),
    );

    return areUpToDate;
}

export async function updateGeneratedClient(database: PrismaDatabase) {
    log.info(`Prisma client for database "${database.databaseName}" is out of date.`);
    await runShellCommand(`prisma generate --schema ${database.schemaFilePath}`, {
        rejectOnError: true,

        cwd: database.cwd,
        env: {
            ...process.env,
            ...database.env,
        },
    });
    log.mutate(`Prisma client updated for "${database.databaseName}"`);
}

export async function ensureGeneratedClientIsUpToDate({
    allowReset,
    database,
    isProd,
}: {
    allowReset: boolean;
    isProd: boolean;
    database: PrismaDatabase;
}): Promise<void> {
    if (await isANewMigrationNeeded(database)) {
        await createNewMigration({allowReset, database, isProd});
    } else if (!(await isGeneratedDatabaseClientUpToDate(database))) {
        await updateGeneratedClient(database);
    }
}
