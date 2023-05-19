import {itCases} from '@augment-vir/chai';
import {join} from 'path';
import {augmentVirRepoDirPath, invalidPackageDirPath} from '../../repo-file-paths.test-helpers';
import {readPackageJson} from './read-package-json';

describe(readPackageJson.name, () => {
    itCases(readPackageJson, [
        {
            it: 'reads a valid package.json file',
            input: augmentVirRepoDirPath,
            throws: undefined,
        },
        {
            it: 'errors on a missing package.json file',
            input: join(augmentVirRepoDirPath, 'packages'),
            throws: Error,
        },
        {
            it: 'errors on an invalid package.json file',
            input: invalidPackageDirPath,
            throws: Error,
        },
    ]);
});
