import {describe, itCases} from '@augment-vir/test';
import {relative} from 'node:path';
import {monoRepoDirPath} from '../../file-paths.mock.js';
import {findNpmBinPath} from './find-bin-path.js';

describe(findNpmBinPath.name, () => {
    function testFindNpmBinPath(...params: Parameters<typeof findNpmBinPath>) {
        const path = findNpmBinPath(...params);

        if (!path) {
            return path;
        }

        return relative(monoRepoDirPath, path);
    }

    itCases(testFindNpmBinPath, [
        {
            it: 'finds a path',
            input: {
                startPath: import.meta.dirname,
                binName: 'tsx',
            },
            expect: 'node_modules/.bin/tsx',
        },
        {
            it: 'fails to find a path',
            input: {
                startPath: '/',
                binName: 'tsx',
            },
            expect: undefined,
        },
    ]);
});
