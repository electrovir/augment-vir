import {
    appendJson,
    JsonCompatibleArray,
    JsonCompatibleObject,
    type JsonCompatibleValue,
} from '@augment-vir/common';
import type {PartialWithUndefined} from '@augment-vir/core';
import {mkdir, readFile} from 'node:fs/promises';
import {dirname} from 'node:path';
import {writeFileAndDir} from './write.js';

/**
 * Read a file and also parse its contents as JSON.
 *
 * @category File : Node
 * @category JSON : Node
 * @package @augment-vir/node
 * @see
 *  - {@link writeJsonFile}
 *  - {@link appendJsonFile}
 */
export async function readJsonFile(path: string): Promise<JsonCompatibleValue | undefined> {
    try {
        const contents = (await readFile(path)).toString();
        return JSON.parse(contents);
    } catch {
        return undefined;
    }
}

/**
 * Options for {@link writeJsonFile}.
 *
 * @category File : Node
 * @category JSON : Node
 * @package @augment-vir/node
 */
export type WriteJsonOptions = PartialWithUndefined<{
    includeTrailingNewLine: boolean;
}>;

/**
 * Write to a file and stringify `data` as JSON before doing so.
 *
 * @category File : Node
 * @category JSON : Node
 * @package @augment-vir/node
 * @see
 *  - {@link readJsonFile}
 *  - {@link appendJsonFile}
 */
export async function writeJsonFile(
    path: string,
    data: JsonCompatibleValue,
    options: WriteJsonOptions = {},
): Promise<void> {
    await mkdir(dirname(path), {recursive: true});

    const trailingNewLine = options.includeTrailingNewLine ? '\n' : '';

    await writeFileAndDir(path, JSON.stringify(data, null, 4) + trailingNewLine);
}

/**
 * Append the given `newData` to the contents of the existing JSON file. If the file does not yet
 * exist, `newData` is written as its only JSON contents.
 *
 * @category File : Node
 * @category JSON : Node
 * @package @augment-vir/node
 * @see
 *  - {@link readJsonFile}
 *  - {@link writeJsonFile}
 */
export async function appendJsonFile(
    path: string,
    newData: JsonCompatibleObject | JsonCompatibleArray,
    options: WriteJsonOptions = {},
): Promise<void> {
    const fileJson = await readJsonFile(path);

    await writeJsonFile(path, appendJson(fileJson, newData), options);
}
