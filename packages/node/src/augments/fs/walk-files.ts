import {awaitedForEach, type MaybePromise, type PartialWithUndefined} from '@augment-vir/common';
import {type Dirent, type PathLike} from 'node:fs';
import {type FileHandle, type readFile} from 'node:fs/promises';
import {join} from 'node:path';

/**
 * Output from `readfile`, used in {@link WalkFilesParams}.
 *
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type ReadFileOutput = Awaited<ReturnType<typeof readFile>>;

/**
 * Params for {@link walkFiles}.
 *
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type WalkFilesParams = {
    /** The directory to start walking files at. */
    startDirPath: string;
    /** Do something with a read file's contents. */
    handleFileContents: (params: {path: string; contents: ReadFileOutput}) => MaybePromise<void>;
} & PartialWithUndefined<{
    /**
     * Check if a file should be read or a directory should be traversed.
     *
     * If this is not provided, every file will be read and every directory will be traversed.
     */
    shouldRead: (params: {path: string; isDir: boolean}) => MaybePromise<boolean>;
    /** Optional overrides for the internally used `node:fs/promises' imports. */
    fs: {
        readFile: (path: PathLike | FileHandle) => MaybePromise<ReadFileOutput>;
        readdir: (
            path: PathLike,
            options: {withFileTypes: true},
        ) => MaybePromise<Pick<Dirent, 'name' | 'isDirectory'>[]>;
    };
}>;

/**
 * Walks files within a directory.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function walkFiles({
    handleFileContents,
    shouldRead,
    startDirPath,
    fs,
}: Readonly<WalkFilesParams>): Promise<void> {
    const {readFile, readdir} = {
        /* node:coverage ignore next 2: dynamic imports are not branches. */
        readFile: fs?.readFile || (await import('node:fs/promises')).readFile,
        readdir: fs?.readdir || (await import('node:fs/promises')).readdir,
    };

    const children = await readdir(startDirPath, {
        withFileTypes: true,
    });

    await awaitedForEach(children, async (file) => {
        const childPath = join(startDirPath, file.name);
        const isDir = file.isDirectory();

        const willRead = shouldRead ? await shouldRead({path: childPath, isDir}) : true;

        if (!willRead) {
            return;
        }

        if (isDir) {
            await walkFiles({
                startDirPath: childPath,
                shouldRead,
                handleFileContents,
            });
        } else {
            await handleFileContents({
                path: childPath,
                contents: await readFile(childPath),
            });
        }
    });
}
