import {readdir, stat} from 'node:fs/promises';
import {join, relative} from 'node:path';
import type {RequireExactlyOne} from 'type-fest';

async function internalReadDirPathsRecursive(dirPath: string, basePath: string): Promise<string[]> {
    const dirContents = await readdir(dirPath);
    const recursiveContents: string[] = (
        await Promise.all(
            dirContents.map(async (fileName): Promise<string | ReadonlyArray<string>> => {
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
 * relative to the given input path.
 *
 * @category File : Node
 * @package @augment-vir/node
 */
export async function readDirRecursive(dirPath: string): Promise<string[]> {
    return await internalReadDirPathsRecursive(dirPath, dirPath);
}

/**
 * Reads all files within a single directory and filters them by the given extension or extensions.
 *
 * @category File : Node
 * @returns That filtered list of paths.
 * @package @augment-vir/node
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
