import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {join} from 'node:path';
import {nodePackageDir, recursiveFileReadDir} from '../../file-paths.mock.js';
import {readDirFilesByExtension, readDirRecursive} from './read-dir.js';

describe(readDirRecursive.name, () => {
    it('should read files in a directory recursively', async () => {
        const allFiles = (await readDirRecursive(recursiveFileReadDir)).sort();
        assert.deepEquals(allFiles, [
            'a-file.txt',
            'b-file.txt',
            join('inner-dir', 'a-file.txt'),
            join('inner-dir', 'b-file.txt'),
            join('inner-dir', 'double-inner-dir', 'a-file.txt'),
            join('inner-dir', 'double-inner-dir', 'b-file.txt'),
        ]);
    });
});

describe(readDirFilesByExtension.name, () => {
    itCases(
        async (...inputs: Parameters<typeof readDirFilesByExtension>) =>
            (await readDirFilesByExtension(...inputs)).sort(),
        [
            {
                it: 'filters to dir files with a single extension',
                input: {dirPath: nodePackageDir, extension: '.json'},
                expect: [
                    'package.json',
                    'tsconfig.json',
                ].sort(),
            },
            {
                it: 'filters to dir files with multiple extensions',
                input: {
                    dirPath: nodePackageDir,
                    extensions: [
                        '.json',
                        '.md',
                    ],
                },
                expect: [
                    'README.md',
                    'package.json',
                    'tsconfig.json',
                ].sort(),
            },
        ],
    );
});
