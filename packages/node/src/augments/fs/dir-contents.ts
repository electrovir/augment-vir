import {check} from '@augment-vir/assert';
import {getObjectTypedEntries} from '@augment-vir/common';
import {readdir, readFile, rm, stat} from 'node:fs/promises';
import {join} from 'node:path';
import {doesPathContain} from '../path/contains.js';
import {writeFileAndDir} from './write.js';

/**
 * Nested contents read from a file system directory.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type DirContents = {
    [Path in string]: string | DirContents;
};

/**
 * Read all contents within a directory and store them in an object. Optionally recursive.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function readAllDirContents(
    dir: string,
    {
        recursive = false,
        excludeList,
    }: {
        recursive?: boolean;
        excludeList?: ReadonlyArray<string | RegExp> | undefined;
    },
): Promise<DirContents> {
    const fileNames = (await readdir(dir)).sort();

    const allFileContents = await Promise.all(
        fileNames.map(async (fileName) => {
            const filePath = join(dir, fileName);

            if (
                excludeList?.some((excludeItem) => {
                    if (check.isString(excludeItem)) {
                        return filePath.includes(excludeItem);
                    } else {
                        return filePath.match(excludeItem);
                    }
                })
            ) {
                return undefined;
            }

            const isFile = (await stat(filePath)).isFile();
            const contents = isFile
                ? await readFile(filePath, 'utf8')
                : recursive
                  ? await readAllDirContents(filePath, {
                        recursive,
                        excludeList,
                    })
                  : undefined;

            if (check.isObject(contents) && !Object.keys(contents).length) {
                return undefined;
            }

            return contents;
        }),
    );

    return fileNames.reduce((accum: DirContents, fileName, index) => {
        if (allFileContents[index] != undefined) {
            const fileContents = allFileContents[index];
            accum[fileName] = fileContents;
        }
        return accum;
    }, {});
}

/**
 * Deletes and entire directory and resets it to the given contents.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function resetDirContents(
    rootDir: string,
    contents: Readonly<DirContents>,
): Promise<void> {
    await rm(rootDir, {
        force: true,
        recursive: true,
    });

    await writeDirContents(rootDir, contents);
}
/**
 * Write {@link DirContents} to a directory.
 *
 * Keys are always relative to `rootDir`. A key that traverses above it (such as `'../escaped.txt'`)
 * throws instead of writing, so contents built from an untrusted source cannot reach outside the
 * directory they were meant for.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function writeDirContents(
    rootDir: string,
    contents: Readonly<DirContents>,
): Promise<void> {
    await Promise.all(
        getObjectTypedEntries(contents).map(
            async ([
                relativePath,
                content,
            ]) => {
                const fullPath = join(rootDir, relativePath);

                if (
                    !doesPathContain({
                        potentialParentPath: rootDir,
                        potentialChildPath: fullPath,
                    })
                ) {
                    throw new Error(
                        `Cannot write '${relativePath}': it resolves outside of '${rootDir}'.`,
                    );
                }

                if (check.isString(content)) {
                    await writeFileAndDir(fullPath, content);
                } else {
                    await writeDirContents(fullPath, content);
                }
            },
        ),
    );
}
