import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {readFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {testFilesDir} from '../file-paths.mock.js';
import {downloadFile} from './download.js';

describe(downloadFile.name, () => {
    it('downloads a file', async () => {
        const outputPath = join(testFilesDir, 'downloaded.html');
        try {
            await downloadFile({
                url: 'https://electrovir.com/index.html',
                writePath: outputPath,
            });
            assert.startsWith((await readFile(outputPath)).toString(), '<!doctype html>');
        } finally {
            await rm(outputPath, {force: true});
        }
    });
});
