import {itCases} from '@augment-vir/chai';
import {join} from 'path';
import {invalidPackageDirPath, virmatorDirPath} from '../../repo-file-paths.test-helpers';
import {readPackageJson} from './read-package-json';

describe(readPackageJson.name, () => {
    itCases(readPackageJson, [
        {
            it: 'reads a valid package.json file',
            input: virmatorDirPath,
            throws: undefined,
        },
        {
            it: 'errors on a missing package.json file',
            input: join(virmatorDirPath, 'packages'),
            throws: Error,
        },
        {
            it: 'errors on an invalid package.json file',
            input: invalidPackageDirPath,
            throws: Error,
        },
    ]);
});
