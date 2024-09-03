import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {readFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {testFilesDir} from '../../file-paths.mock.js';
import {downloadFile} from './download.js';

describe(downloadFile.name, () => {
    it('downloads a file', async () => {
        const outputPath = join(testFilesDir, 'downloaded.json');
        try {
            await downloadFile({
                url: 'https://electrovir.github.io/date-vir/index.html',
                writePath: outputPath,
            });
            assert.startsWith((await readFile(outputPath)).toString(), '<!DOCTYPE html>');
        } finally {
            await rm(outputPath, {force: true});
        }
    });
    it('fails on an invalid file', async () => {
        const outputPath = join(testFilesDir, 'downloaded.json');
        try {
            await assert.throws(
                downloadFile({
                    url: 'https://electrovir.github.io/date-vir/invalid.html',
                    writePath: outputPath,
                }),
            );
        } finally {
            await rm(outputPath, {force: true});
        }
    });
});
