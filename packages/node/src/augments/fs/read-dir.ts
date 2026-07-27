import {type RequireExactlyOne} from '@augment-vir/common';
import {readdir, stat} from 'node:fs/promises';
import {join, relative} from 'node:path';

async function internalReadDirPathsRecursive({
    dirPath,
    basePath,
}: Readonly<{dirPath: string; basePath: string}>): Promise<string[]> {
    const dirContents = await readdir(dirPath);
    const recursiveContents: string[] = (
        await Promise.all(
            dirContents.map(async (fileName): Promise<string | ReadonlyArray<string>> => {
                const filePath = join(dirPath, fileName);
                if ((await stat(filePath)).isDirectory()) {
                    return internalReadDirPathsRecursive({
                        dirPath: filePath,
                        basePath,
                    });
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
 * relative to the given input path.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function readDirRecursive(dirPath: string): Promise<string[]> {
    return await internalReadDirPathsRecursive({
        dirPath,
        basePath: dirPath,
    });
}

/**
 * Reads all files within a single directory and filters them by the given extension or extensions.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @returns That filtered list of paths.
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function readDirFilesByExtension({
    dirPath,
    extension,
    extensions,
}: {
    dirPath: string;
} & RequireExactlyOne<{
    extension: string;
    extensions: ReadonlyArray<string>;
}>) {
    const extensionsToCheck: ReadonlyArray<string> = extensions || [extension];

    const fileNames = await readdir(dirPath);

    return fileNames.filter((fileName) =>
        extensionsToCheck.some((extensionToCheck) => fileName.endsWith(extensionToCheck)),
    );
}
