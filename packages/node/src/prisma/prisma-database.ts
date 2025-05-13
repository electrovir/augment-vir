import {runPrismaCommand} from './run-prisma-command.js';

export async function getPrismaDiff(
    schemaFilePath: string,
    env: Record<string, string> = {},
): Promise<string> {
    const command = [
        'migrate',
        'diff',
        `--from-schema-datamodel='${schemaFilePath}'`,
        `--to-schema-datasource='${schemaFilePath}'`,
    ].join(' ');

    const results = await runPrismaCommand({command}, undefined, env);

    if (results.stdout.trim() === 'No difference detected.') {
        return '';
    } else {
        return results.stdout.trim();
    }
}

export async function doesPrismaDiffExist(
    schemaFilePath: string,
    env: Record<string, string> = {},
): Promise<boolean> {
    return !!(await getPrismaDiff(schemaFilePath, env));
}

export async function resetDevPrismaDatabase(
    schemaFilePath: string,
    options: {
        /**
         * If you already have migrations created, set this to `true`. If you don't, set it to
         * `false`. If you don't know which one to use, try both, see which one creates a valid
         * database for you (try querying it with PrismaClient after running this; if it errors,
         * this didn't create a valid database).
         */
        withMigrations: boolean;
    },
    env: Record<string, string> = {},
) {
    if (options.withMigrations) {
        await runPrismaCommand(
            {command: 'migrate reset --force --skip-generate --skip-seed'},
            schemaFilePath,
            env,
        );
    } else {
        await runPrismaCommand(
            {
                command: 'db push --accept-data-loss --skip-generate',
            },
            schemaFilePath,
            env,
        );
    }
}
