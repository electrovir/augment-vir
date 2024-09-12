import {existsSync} from 'node:fs';
import {lstat, readlink, stat, symlink} from 'node:fs/promises';

/**
 * Creates a symlink.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function createSymlink({
    linkTo,
    symlinkPath,
}: {
    /**
     * Path that the symlink will link to. If relative, it will be linked relative to the symlink
     * location.
     */
    linkTo: string;
    /** The location and name the symlink file to be created. */
    symlinkPath: string;
}): Promise<void> {
    if (existsSync(symlinkPath)) {
        if (!(await lstat(symlinkPath)).isSymbolicLink()) {
            throw new Error(
                `Tried to create symlink at '${symlinkPath}' but a non-symlink file already exists in that location.`,
            );
        } else if ((await readlink(symlinkPath)) !== linkTo) {
            throw new Error(
                `Symlink already exists at '${symlinkPath}' but has a differently link path.`,
            );
        }
    } else {
        const isDir = (await stat(linkTo)).isDirectory();
        await symlink(linkTo, symlinkPath, isDir ? 'dir' : 'file');
    }
}
