import {existsSync} from 'fs';
import {ensureDir} from 'fs-extra';
import {lstat, readlink, symlink, writeFile} from 'fs/promises';
import {dirname} from 'path';

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

export async function writeFileAndDir(
    path: string,
    contents: string | NodeJS.ArrayBufferView,
): Promise<void> {
    await ensureDir(dirname(path));
    await writeFile(path, contents);
}
