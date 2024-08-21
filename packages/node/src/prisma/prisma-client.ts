import {collapseWhiteSpace} from '@augment-vir/common';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {runPrismaCommand} from './run-prisma-command.js';

/**
 * Runs Prisma generators included in the given Prisma schema (which usually includes the Prisma JS
 * client). This will work even if the database doesn't exist yet.
 */
export async function generatePrismaClient(
    schemaFilePath: string,
    env: Record<string, string> = {},
) {
    await runPrismaCommand({command: 'generate'}, schemaFilePath, env);
}

async function areSchemasEqual(
    originalSchema: string,
    generatedClientSchema: string,
): Promise<boolean> {
    if (!existsSync(originalSchema)) {
        throw new Error(`Schema file does not exist: '${originalSchema}'`);
    } else if (!existsSync(generatedClientSchema)) {
        return false;
    }

    const originalSchemaContents: string = String(await readFile(originalSchema));
    const generatedClientSchemaContents: string = String(await readFile(generatedClientSchema));

    return (
        collapseWhiteSpace(originalSchemaContents, {keepNewLines: true}) ===
        collapseWhiteSpace(generatedClientSchemaContents, {keepNewLines: true})
    );
}

export async function isGeneratedPrismaClientCurrent({
    jsClientOutputDir,
    schemaFilePath,
}: {
    schemaFilePath: string;
    jsClientOutputDir: string;
}) {
    const clientSchemaFilePath = join(jsClientOutputDir, 'schema.prisma');

    return areSchemasEqual(schemaFilePath, clientSchemaFilePath);
}
