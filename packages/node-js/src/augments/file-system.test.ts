import {itCases} from '@augment-vir/chai';
import {executeAndReturnError} from '@augment-vir/common';
import chai, {assert, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {existsSync} from 'fs';
import {remove} from 'fs-extra';
import {lstat, readFile, writeFile} from 'fs/promises';
import {describe, it} from 'mocha';
import {tmpdir} from 'os';
import {join} from 'path';
import {nodeJsPackageDir, recursiveFileReadDir} from '../repo-file-paths.test-helpers';
import {
    createSymLink,
    readDirFilesByExtension,
    readDirRecursive,
    writeFileAndDir,
} from './file-system';

describe(createSymLink.name, () => {
    const symlinkPath = join(tmpdir(), 'test-symlink');

    it('creates symlink', async () => {
        try {
            const existsBeforeTest = existsSync(symlinkPath);
            await createSymLink(__dirname, symlinkPath, true);
            const existsAfterTest = existsSync(symlinkPath);
            const isSymLink = (await lstat(symlinkPath)).isSymbolicLink();
            await remove(symlinkPath);
            const existsAfterDeletion = existsSync(symlinkPath);

            assert.deepStrictEqual(
                {
                    existsBeforeTest,
                    existsAfterTest,
                    isSymLink,
                    existsAfterDeletion,
                },
                {
                    existsBeforeTest: false,
                    existsAfterTest: true,
                    isSymLink: true,
                    existsAfterDeletion: false,
                },
            );
        } finally {
            await remove(symlinkPath);
        }
    });

    it('errors if there is already a file at the given location', async () => {
        try {
            const existsBeforeTest = existsSync(symlinkPath);
            await writeFile(symlinkPath, '');
            const existsAfterFileCreation = existsSync(symlinkPath);
            const thrownError = await executeAndReturnError(() =>
                createSymLink(__dirname, symlinkPath, true),
            );
            await remove(symlinkPath);
            const existsAfterFileDeletion = existsSync(symlinkPath);

            chai.use(chaiAsPromised);
            assert.deepStrictEqual(
                {
                    existsBeforeTest,
                    existsAfterFileCreation,
                    existsAfterFileDeletion,
                },
                {
                    existsBeforeTest: false,
                    existsAfterFileCreation: true,
                    existsAfterFileDeletion: false,
                },
            );
            assert.instanceOf(thrownError, Error);
        } finally {
            await remove(symlinkPath);
        }
    });
});

describe(writeFileAndDir.name, () => {
    const paths = [
        'test-dir-long-gibberish-name',
        'test-dir-2-less-long',
        'blah-blah-file.txt',
    ] as const;
    const testOutputPath = join(...paths);
    const testFileContent = 'blah blah blah';

    it('creates output file with all directories', async () => {
        const results: boolean[] = [];

        expect(existsSync(paths[0])).to.equal(false);

        try {
            await writeFileAndDir(testOutputPath, testFileContent);
            expect(existsSync(testOutputPath)).to.equal(true);
            expect(testFileContent === (await readFile(testOutputPath)).toString()).to.equal(true);
        } catch (error) {}

        await remove(paths[0]);
        expect(existsSync(testOutputPath)).to.equal(false);

        return results;
    });
});

describe(readDirRecursive.name, () => {
    it('should read files in a directory recursively', async () => {
        const allFiles = (await readDirRecursive(recursiveFileReadDir)).sort();
        expect(allFiles).to.deep.equal([
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
                input: {dirPath: nodeJsPackageDir, extension: '.json'},
                expect: [
                    'package.json',
                    'tsconfig.json',
                ].sort(),
            },
            {
                it: 'filters to dir files with multiple extensions',
                input: {
                    dirPath: nodeJsPackageDir,
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
