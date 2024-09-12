import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {readFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {writeFileAndDir} from './write.js';

describe(writeFileAndDir.name, () => {
    const paths = [
        'test-dir-long-gibberish-name',
        'test-dir-2-less-long',
        'blah-blah-file.txt',
    ] as const;
    const testOutputPath = join(...paths);
    const testFileContent = 'blah blah blah';

    it('creates output file with all directories', async () => {
        assert.isFalse(existsSync(paths[0]));

        try {
            await writeFileAndDir(testOutputPath, testFileContent);
            assert.isTrue(existsSync(testOutputPath));
            assert.isTrue(testFileContent === (await readFile(testOutputPath)).toString());
        } catch {
            // do nothing
        }

        await rm(paths[0], {
            force: true,
            recursive: true,
        });
        assert.isFalse(existsSync(testOutputPath));
    });
});
