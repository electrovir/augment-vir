import {join} from 'path';

const currentDir = __dirname;

const testReposDir = join(currentDir, 'test-repos');
export const longRunningFile = join(testReposDir, 'long-running-file.js');
export const longRunningFileWithStderr = join(testReposDir, 'long-running-file-with-stderr.js');
