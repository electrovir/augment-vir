import {dirname, join} from 'path';

export const virmatorDirPath = dirname(dirname(dirname(__dirname)));

export const nodeJsPackageDir = dirname(__dirname);

const testFilesDir = join(nodeJsPackageDir, 'test-files');
const longRunningFileDir = join(testFilesDir, 'long-running-test-file');
export const longRunningFile = join(longRunningFileDir, 'long-running-file.ts');
export const longRunningFileWithStderr = join(
    longRunningFileDir,
    'long-running-file-with-stderr.ts',
);

export const recursiveFileReadDir = join(testFilesDir, 'recursive-reading');

export const invalidPackageDirPath = join(testFilesDir, 'invalid-package');
