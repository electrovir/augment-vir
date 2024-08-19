import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {lstat, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createSymlink} from './symlink.js';

describe(createSymlink.name, () => {
    const testSymlinkFilePath = join(tmpdir(), 'test-symlink');

    it('creates symlink to a directory', async () => {
        try {
            await createSymlink({linkTo: import.meta.dirname, symlinkPath: testSymlinkFilePath});

            assert.isTrue(existsSync(testSymlinkFilePath));
            assert.isTrue((await lstat(testSymlinkFilePath)).isSymbolicLink());
        } finally {
            await rm(testSymlinkFilePath, {force: true});
        }
    });
    it('creates symlink to a file', async () => {
        try {
            await createSymlink({
                linkTo: join(import.meta.filename),
                symlinkPath: testSymlinkFilePath,
            });

            assert.isTrue(existsSync(testSymlinkFilePath));
            assert.isTrue((await lstat(testSymlinkFilePath)).isSymbolicLink());
        } finally {
            await rm(testSymlinkFilePath, {force: true});
        }
    });
    it('errors if there is already a symlink', async () => {
        try {
            await createSymlink({linkTo: import.meta.dirname, symlinkPath: testSymlinkFilePath});
            await assert.throws(
                createSymlink({
                    linkTo: join(import.meta.dirname, 'something-else'),
                    symlinkPath: testSymlinkFilePath,
                }),
                {
                    matchMessage: 'but has a differently link path',
                },
            );
        } finally {
            await rm(testSymlinkFilePath, {force: true});
        }
    });
    it('errors if there is already a file at the given location', async () => {
        try {
            await writeFile(testSymlinkFilePath, 'test');
            await assert.throws(
                createSymlink({linkTo: import.meta.dirname, symlinkPath: testSymlinkFilePath}),
                {
                    matchMessage: 'but a non-symlink file already exists in that location',
                },
            );
        } finally {
            await rm(testSymlinkFilePath, {force: true});
        }
    });
});
