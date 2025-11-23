import {assert} from '@augment-vir/assert';
import {filterObject} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {join, sep} from 'node:path';
import {dirContentsTestDir} from '../../file-paths.mock.js';
import {walkFiles, type WalkFilesParams} from './walk-files.js';

describe(walkFiles.name, () => {
    type WalkedFiles = {
        [Path in string]:
            | WalkedFiles
            /* A file's contents. */
            | string
            | undefined;
    };

    const allWalkedFiles: WalkedFiles = {
        [join(dirContentsTestDir, 'a.ts')]: "export function hello() {\n    return 'hi';\n}\n",
        [join(dirContentsTestDir, 'b', 'b.txt')]: 'nested text file',
        [join(dirContentsTestDir, 'package.json')]: '{}\n',
    };

    async function testWalkFiles(params: Readonly<Omit<WalkFilesParams, 'handleFileContents'>>) {
        const walkedFiles: WalkedFiles = {};

        await walkFiles({
            ...params,
            handleFileContents({contents, path}) {
                walkedFiles[path] = String(contents);
            },
        });

        return walkedFiles;
    }

    it('walks everything', async () => {
        assert.deepEquals(
            await testWalkFiles({
                startDirPath: dirContentsTestDir,
            }),
            allWalkedFiles,
        );
    });

    it('walks some things', async () => {
        assert.deepEquals(
            await testWalkFiles({
                startDirPath: dirContentsTestDir,
                shouldRead({isDir}) {
                    return !isDir;
                },
            }),
            filterObject(allWalkedFiles, (key) => !String(key).includes(`b${sep}`)),
        );
    });

    it('accepts fs overrides', async () => {
        assert.deepEquals(
            await testWalkFiles({
                startDirPath: dirContentsTestDir,
                fs: {
                    readdir() {
                        return [
                            {
                                isDirectory() {
                                    return false;
                                },
                                name: 'a',
                            },
                        ];
                    },
                    readFile() {
                        return 'fake';
                    },
                },
            }),
            {
                [join(dirContentsTestDir, 'a')]: 'fake',
            },
        );
    });
});
