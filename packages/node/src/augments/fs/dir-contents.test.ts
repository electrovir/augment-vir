import {assert} from '@augment-vir/assert';
import {wrapString} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, join, sep} from 'node:path';
import {dirContentsTestDir} from '../../file-paths.mock.js';
import {readAllDirContents, resetDirContents} from './dir-contents.js';

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
