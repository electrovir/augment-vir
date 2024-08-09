import {join, resolve} from 'node:path';

export const monoRepoDirPath = resolve(import.meta.dirname, '..', '..', '..');
export const monoRepoNodeModulesDirPath = join(monoRepoDirPath, 'node_modules');
export const packagesDirPath = join(monoRepoDirPath, 'packages');
export const packages = {
    testDirPath: join(packagesDirPath, 'test'),
};
