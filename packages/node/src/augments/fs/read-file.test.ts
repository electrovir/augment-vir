import {describe, itCases} from '@augment-vir/test';
import {join} from 'node:path';
import {testFilesDir, workspaceQueryPackageJsonPath} from '../../file-paths.mock.js';
import {readFileIfExists} from './read-file.js';

describe(readFileIfExists.name, () => {
    itCases(readFileIfExists, [
        {
            it: 'reads a file',
            input: workspaceQueryPackageJsonPath,
            expect: '{\n    "type": "module"\n}\n',
        },
        {
            it: 'handles a missing file',
            input: join(testFilesDir, 'missing', 'does-not-exist.json'),
            expect: undefined,
        },
    ]);
});
