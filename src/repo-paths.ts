import {join} from 'path';

const currentDir = __dirname;

const testFilesDir = join(currentDir, 'test-files');
export const longRunningFile = join(testFilesDir, 'long-running-file.ts');
export const longRunningFileWithStderr = join(testFilesDir, 'long-running-file-with-stderr.ts');
