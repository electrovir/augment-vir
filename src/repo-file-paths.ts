import {dirname, join} from 'path';

const repoDir = dirname(__dirname);

const testFilesDir = join(repoDir, 'test-files');
const longRunningFileDir = join(testFilesDir, 'long-running-test-file');
export const longRunningFile = join(longRunningFileDir, 'long-running-file.ts');
export const longRunningFileWithStderr = join(
    longRunningFileDir,
    'long-running-file-with-stderr.ts',
);

export const recursiveFileReadDir = join(testFilesDir, 'recursive-reading');
