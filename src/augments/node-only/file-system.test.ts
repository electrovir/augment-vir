import {existsSync, lstat, readFile, remove} from 'fs-extra';
import {join} from 'path';
import {createSymLink, writeFileAndDir} from './file-system';

describe(createSymLink.name, () => {
    const symlinkPath = 'test-symlink';

    it('creates symlink', async () => {
        try {
            expect(existsSync(symlinkPath)).toBe(false);
            await createSymLink(__dirname, symlinkPath);
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
