import {assert} from '@augment-vir/assert';
import {wrapString} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import {dirname, join, sep} from 'node:path';
import {dirContentsTestDir} from '../../file-paths.mock.js';
import {readAllDirContents, resetDirContents, writeDirContents} from './dir-contents.js';

describe(readAllDirContents.name, () => {
    it('reads contents', async () => {
        const output = await readAllDirContents(dirContentsTestDir, {
            recursive: true,
        });

        assert.deepEquals(output, {
            'a.ts': "export function hello() {\n    return 'hi';\n}\n",
            'package.json': '{}\n',
            b: {
                'b.txt': 'nested text file',
            },
        });
    });
    it('does not recurse', async () => {
        const output = await readAllDirContents(dirContentsTestDir, {});

        assert.deepEquals(output, {
            'a.ts': "export function hello() {\n    return 'hi';\n}\n",
            'package.json': '{}\n',
        });
    });

    it('excludes files', async () => {
        const output = await readAllDirContents(dirContentsTestDir, {
            recursive: true,
            excludeList: [
                wrapString({
                    value: 'b',
                    wrapper: sep,
                }),
            ],
        });

        assert.deepEquals(output, {
            'a.ts': "export function hello() {\n    return 'hi';\n}\n",
            'package.json': '{}\n',
        });
    });

    it('excludes regexps', async () => {
        const output = await readAllDirContents(dirContentsTestDir, {
            recursive: true,
            excludeList: [/b/],
        });

        assert.deepEquals(output, {
            'a.ts': "export function hello() {\n    return 'hi';\n}\n",
            'package.json': '{}\n',
        });
    });
});

describe(resetDirContents.name, () => {
    it('resets a dir', async () => {
        const originalContents = await readAllDirContents(dirContentsTestDir, {
            recursive: true,
        });

        const extraFilePath = join(dirContentsTestDir, 'more', 'another.txt');
        await mkdir(dirname(extraFilePath), {
            recursive: true,
        });

        await writeFile(extraFilePath, 'test');
        assert.strictEquals(existsSync(extraFilePath), true);
        await resetDirContents(dirContentsTestDir, originalContents);
        assert.strictEquals(existsSync(extraFilePath), false);
    });
});

describe(writeDirContents.name, () => {
    it('writes nested contents relative to the root', async () => {
        const writeDir = join(dirContentsTestDir, 'write-contents');

        await resetDirContents(writeDir, {
            'top.txt': 'top',
            nested: {
                'inner.txt': 'inner',
            },
        });

        assert.deepEquals(
            await readAllDirContents(writeDir, {
                recursive: true,
            }),
            {
                'top.txt': 'top',
                nested: {
                    'inner.txt': 'inner',
                },
            },
        );

        await rm(writeDir, {
            force: true,
            recursive: true,
        });
    });

    it('rejects a key that traverses above the root', async () => {
        const escapedPath = join(dirContentsTestDir, 'escaped.txt');

        await assert.throws(
            () => {
                return writeDirContents(join(dirContentsTestDir, 'contained'), {
                    [join('..', 'escaped.txt')]: 'should not be written',
                });
            },
            {
                matchMessage: 'resolves outside of',
            },
        );

        assert.strictEquals(existsSync(escapedPath), false);
    });

    it('rejects a traversing key nested inside a valid key', async () => {
        const escapedPath = join(dirContentsTestDir, 'escaped-nested.txt');

        await assert.throws(
            () => {
                return writeDirContents(join(dirContentsTestDir, 'contained'), {
                    inner: {
                        [join('..', '..', 'escaped-nested.txt')]: 'should not be written',
                    },
                });
            },
            {
                matchMessage: 'resolves outside of',
            },
        );

        assert.strictEquals(existsSync(escapedPath), false);
    });

    it('allows a key that traverses down and back within the root', async () => {
        const writeDir = join(dirContentsTestDir, 'write-back-within');

        await writeDirContents(writeDir, {
            [join('down', '..', 'settled.txt')]: 'settled',
        });

        assert.strictEquals(existsSync(join(writeDir, 'settled.txt')), true);

        await rm(writeDir, {
            force: true,
            recursive: true,
        });
    });
});
