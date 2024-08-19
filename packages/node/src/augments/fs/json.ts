import {check, getRuntimeType} from '@augment-vir/assert';
import {
    JsonCompatibleArray,
    JsonCompatibleObject,
    type JsonCompatibleValue,
} from '@augment-vir/common';
import type {PartialWithUndefined} from '@augment-vir/core';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';

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

    await writeFile(path, JSON.stringify(data, null, 4) + trailingNewLine);
}

export async function appendJsonFile(
    path: string,
    newData: JsonCompatibleObject | JsonCompatibleArray,
    options: WriteJsonOptions = {},
): Promise<void> {
    await mkdir(dirname(path), {recursive: true});
    const fileJson = await readJsonFile(path);

    if (fileJson === undefined) {
        await writeJsonFile(path, newData, options);

        return;
    }

    const original = typeof fileJson === 'object' ? fileJson : [fileJson];

    const withAppendedData: JsonCompatibleObject | JsonCompatibleArray | undefined =
        check.isArray(original) && check.isArray(newData)
            ? [
                  ...original,
                  ...newData,
              ]
            : check.isObject(original) && check.isObject(newData)
              ? {
                    ...original,
                    ...newData,
                }
              : undefined;

    if (!withAppendedData) {
        throw new TypeError(
            `Type mismatch between new JSON data to append and current JSON data at '${path}': current file is '${getRuntimeType(
                original,
            )}' and new data is '${getRuntimeType(newData)}'`,
        );
    }

    await writeJsonFile(path, withAppendedData, options);
}
