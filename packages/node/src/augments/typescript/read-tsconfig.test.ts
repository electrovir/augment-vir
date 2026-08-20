import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {join} from 'node:path';
import {nodePackageDir, testFilesDir} from '../../file-paths.mock.js';
import {readTsconfig} from './read-tsconfig.js';

describe(readTsconfig.name, () => {
    it('parses a valid tsconfig with the installed typescript version', () => {
        const found = readTsconfig(import.meta.filename);

        assert.isDefined(found);
        assert.strictEquals(found.path, join(nodePackageDir, 'tsconfig.json'));
        assert.deepEquals(found.tsconfig.options.paths, {
            'something-crazy/*': ['./src/*'],
        });
        /** `outDir` is only resolved to an absolute path by the full tsconfig parse. */
        assert.strictEquals(found.tsconfig.options.outDir, join(nodePackageDir, 'dist'));
        assert.isIn(import.meta.filename, found.tsconfig.fileNames);
    });

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
