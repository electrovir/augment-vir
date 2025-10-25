import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {join} from 'node:path';
import {monoRepoDirPath} from '../../file-paths.mock.js';
import {systemRootPath} from '../path/root.js';
import {findAllPackageJsonFilePaths} from './package-json.js';

describe(findAllPackageJsonFilePaths.name, () => {
    it('finds all augment-vir deps', async () => {
        assert.deepEquals(
            await findAllPackageJsonFilePaths(import.meta.dirname),
            [
                'package.json',
                join('packages', 'assert', 'package.json'),
                join('packages', 'common', 'package.json'),
                join('packages', 'core', 'package.json'),
                join('packages', 'node', 'package.json'),
                join('packages', 'scripts', 'package.json'),
                join('packages', 'test', 'package.json'),
                join('packages', 'web', 'package.json'),
            ].map((path) => join(monoRepoDirPath, path)),
        );
    });

    it('errors out if no package-lock.json is found', async () => {
        await assert.throws(() => findAllPackageJsonFilePaths(systemRootPath), {
            matchMessage: 'failed to find any directory with a package-lock.json file',
        });
    });
});
