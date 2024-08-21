import {rm} from 'node:fs/promises';
import {
    generatedPrismaClientDirPath,
    notCommittedDirPath,
    testPrismaMigrationsDirPath,
} from '../file-paths.mock.js';

export async function clearTestDatabaseOutputs() {
    await rm(generatedPrismaClientDirPath, {force: true, recursive: true});
    await rm(notCommittedDirPath, {force: true, recursive: true});
    await rm(testPrismaMigrationsDirPath, {force: true, recursive: true});
}
