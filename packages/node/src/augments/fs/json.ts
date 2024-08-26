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

export async function readJsonFile(path: string): Promise<JsonCompatibleValue | undefined> {
    try {
        const contents = (await readFile(path)).toString();
        return JSON.parse(contents);
    } catch {
        return undefined;
    }
}

export type WriteJsonOptions = PartialWithUndefined<{
    includeTrailingNewLine: boolean;
}>;

export async function writeJsonFile(
    path: string,
    data: JsonCompatibleValue,
    options: WriteJsonOptions = {},
): Promise<void> {
    await mkdir(dirname(path), {recursive: true});

    const trailingNewLine = options.includeTrailingNewLine ? '\n' : '';

    await writeFileAndDir(path, JSON.stringify(data, null, 4) + trailingNewLine);
}

export async function appendJsonFile(
    path: string,
    newData: JsonCompatibleObject | JsonCompatibleArray,
    options: WriteJsonOptions = {},
): Promise<void> {
    const fileJson = await readJsonFile(path);

    await writeJsonFile(path, appendJson(fileJson, newData), options);
}
