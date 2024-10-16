import {describe, itCases} from '@augment-vir/test';
import {join} from 'node:path';
import {invalidPackageDirPath, monoRepoDirPath} from '../../file-paths.mock.js';
import {readPackageJson} from './read-package-json.js';

describe(readPackageJson.name, () => {
    itCases(readPackageJson, [
        {
            it: 'reads a valid package.json file',
            input: monoRepoDirPath,
            throws: undefined,
        },
        {
            it: 'errors on a missing package.json file',
            input: join(monoRepoDirPath, 'packages'),
            throws: {
                matchConstructor: TypeError,
            },
        },
        {
            it: 'errors on an invalid package.json file',
            input: invalidPackageDirPath,
            throws: {
                matchConstructor: TypeError,
            },
        },
    ]);
});
