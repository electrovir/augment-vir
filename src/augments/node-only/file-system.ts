import {existsSync} from 'fs';
import {ensureDir} from 'fs-extra';
import {lstat, readdir, readlink, stat, symlink, writeFile} from 'fs/promises';
import {dirname, join, relative} from 'path';

export async function createSymLink(
    /**
     * Path that the symlink will link to. If relative, it will be linked relative to the symlink
     * location itself.
     */
    linkPath: string,
    /** The location and name the symlink file itself. */
    symlinkLocationPath: string,
    /** This is required to keep windows happy. If you're creating a symlink to a directory, set this to true. */
    dir: boolean,
): Promise<void> {
    if (existsSync(symlinkLocationPath)) {
        if (!(await lstat(symlinkLocationPath)).isSymbolicLink()) {
            throw new Error(
                `Tried to create symlink at ${symlinkLocationPath} but a non-symlink file already existed in that location.`,
            );
        }
        if ((await readlink(symlinkLocationPath)) !== linkPath) {
            throw new Error(
                `Symlink already exists at ${symlinkLocationPath} but has a differently link path.`,
            );
        }
    } else {
        await symlink(linkPath, symlinkLocationPath, dir ? 'dir' : 'file');
    }
}

/** Writes to the given file path and always ensures that the path's parent directories are all created. */
export async function writeFileAndDir(
    path: string,
    contents: string | NodeJS.ArrayBufferView,
): Promise<void> {
    await ensureDir(dirname(path));
    await writeFile(path, contents);
}

async function internalReadDirPathsRecursive(dirPath: string, basePath: string): Promise<string[]> {
    const dirContents = await readdir(dirPath);
    const recursiveContents: string[] = (
        await Promise.all(
            dirContents.map(async (fileName): Promise<string | string[]> => {
                const filePath = join(dirPath, fileName);
                if ((await stat(filePath)).isDirectory()) {
                    return internalReadDirPathsRecursive(filePath, basePath);
                } else {
                    return relative(basePath, filePath);
                }
            }),
        )
    ).flat();

    return recursiveContents;
}

/**
 * Gets all files within a directory and its subdirectories, recursively. Returns an array of paths
 * relative to the input directory path.
 */
export async function readDirRecursive(dirPath: string): Promise<string[]> {
    return await internalReadDirPathsRecursive(dirPath, dirPath);
}
