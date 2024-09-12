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
    env: Record<string, string> = {},
) {
    await runPrismaCommand({command: 'migrate reset --force'}, schemaFilePath, env);
}
