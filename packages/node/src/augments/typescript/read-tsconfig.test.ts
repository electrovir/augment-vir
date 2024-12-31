import {describe, itCases} from '@augment-vir/test';
import {join} from 'node:path';
import {testFilesDir} from '../../file-paths.mock.js';
import {readTsconfig} from './read-tsconfig.js';

describe(readTsconfig.name, () => {
    itCases(readTsconfig, [
        {
            it: 'rejects an invalid tsconfig',
            input: join(testFilesDir, 'invalid-tsconfig'),
            expect: undefined,
        },
        {
            it: 'rejects an extended invalid tsconfig',
            input: join(testFilesDir, 'invalid-json-tsconfig'),
            expect: undefined,
        },
    ]);
});
