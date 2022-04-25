import {existsSync} from 'fs';
import {remove} from 'fs-extra';
import {lstat, readFile} from 'fs/promises';
import {join} from 'path';
import {recursiveFileReadDir} from '../../repo-file-paths';
import {createSymLink, readDirRecursive, writeFileAndDir} from './file-system';

describe(createSymLink.name, () => {
    const symlinkPath = 'test-symlink';

    it('creates symlink', async () => {
        try {
            expect(existsSync(symlinkPath)).toBe(false);
            await createSymLink(__dirname, symlinkPath, true);
            expect(existsSync(symlinkPath)).toBe(true);
            expect((await lstat(symlinkPath)).isSymbolicLink()).toBe(true);
        } catch (error) {
            throw error;
        } finally {
            await remove(symlinkPath);
            expect(existsSync(symlinkPath)).toBe(false);
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

        expect(existsSync(paths[0])).toBe(false);

        try {
            await writeFileAndDir(testOutputPath, testFileContent);
            expect(existsSync(testOutputPath)).toBe(true);
            expect(testFileContent === (await readFile(testOutputPath)).toString()).toBe(true);
        } catch (error) {}

        await remove(paths[0]);
        expect(existsSync(testOutputPath)).toBe(false);

        return results;
    });
});

describe(readDirRecursive.name, () => {
    it('should read files in a directory recursively', async () => {
        const allFiles = (await readDirRecursive(recursiveFileReadDir)).sort();
        expect(allFiles).toEqual([
            'a-file.txt',
            'b-file.txt',
            join('inner-dir', 'a-file.txt'),
            join('inner-dir', 'b-file.txt'),
            join('inner-dir', 'double-inner-dir', 'a-file.txt'),
            join('inner-dir', 'double-inner-dir', 'b-file.txt'),
        ]);
    });
});
