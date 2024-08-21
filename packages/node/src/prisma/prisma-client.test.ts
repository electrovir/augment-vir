import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {prisma} from '../augments/prisma.js';
import {generatedPrismaClientDirPath, testPrismaSchemaPath} from '../file-paths.mock.js';
import {clearTestDatabaseOutputs} from './prisma-database.mock.js';

describe(prisma.client.generate.name, () => {
    it('generates clients even if the database does not exist', async () => {
        await clearTestDatabaseOutputs();

        await prisma.client.generate(testPrismaSchemaPath);

        assert.isTrue(existsSync(generatedPrismaClientDirPath));
    });
});

describe(prisma.client.generate.name, () => {
    it('generates clients even if the database does not exist', async () => {
        await clearTestDatabaseOutputs();

        assert.isFalse(
            await prisma.client.isCurrent({
                jsClientOutputDir: generatedPrismaClientDirPath,
                schemaFilePath: testPrismaSchemaPath,
            }),
        );
        await prisma.client.generate(testPrismaSchemaPath);

        assert.isTrue(
            await prisma.client.isCurrent({
                jsClientOutputDir: generatedPrismaClientDirPath,
                schemaFilePath: testPrismaSchemaPath,
            }),
        );
    });
    it('errors on invalid schema path', async () => {
        await clearTestDatabaseOutputs();

        await assert.throws(
            prisma.client.isCurrent({
                jsClientOutputDir: generatedPrismaClientDirPath,
                schemaFilePath: testPrismaSchemaPath + '.ts',
            }),
            {
                matchMessage: 'Schema file does not exist',
            },
        );
    });
});
