import {dirname, join} from 'node:path';

export const monoRepoDirPath = dirname(dirname(dirname(import.meta.dirname)));
export const notCommittedDirPath = join(monoRepoDirPath, '.not-committed');

export const nodePackageDir = dirname(import.meta.dirname);

export const testFilesDir = join(nodePackageDir, 'test-files');
const longRunningFileDir = join(testFilesDir, 'long-running-test-file');
export const longRunningFilePath = join(longRunningFileDir, 'long-running-file.ts');
export const longRunningFileWithStderr = join(
    longRunningFileDir,
    'long-running-file-with-stderr.ts',
);
export const workspaceQueryDir = join(testFilesDir, 'workspace-query');
export const workspaceQueryPackageJsonPath = join(workspaceQueryDir, 'package.json');
export const tempWorkspaceQueryFile = join(workspaceQueryDir, 'temp-workspace-query-output.ts');

export const recursiveFileReadDir = join(testFilesDir, 'recursive-reading');

export const invalidPackageDirPath = join(testFilesDir, 'invalid-package');

export const testPrismaSchemaPath = join(testFilesDir, 'schema.prisma');
export const testPrismaSchema2Path = join(testFilesDir, 'schema2.prisma');
export const testInvalidPrismaSchemaPath = join(testFilesDir, 'invalid-schema.prisma');
export const testSqliteDbPath = join(notCommittedDirPath, 'dev.db');
export const generatedPrismaClientDirPath = join(nodePackageDir, 'node_modules', '.prisma');
export const testPrismaMigrationsDirPath = join(testFilesDir, 'migrations');
