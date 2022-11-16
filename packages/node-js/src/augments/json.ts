import {typeOfWithArray} from '@augment-vir/common';
import {ensureDir} from 'fs-extra';
import {readFile, writeFile} from 'fs/promises';
import {dirname} from 'path';
import {JsonArray, JsonObject, JsonValue} from 'type-fest';

export async function readJson<T extends JsonValue>(path: string): Promise<T> {
    try {
        const json = JSON.parse((await readFile(path)).toString());
        return json;
    } catch (error) {
        return {} as T;
    }
}

export async function writeJson<T extends JsonObject | JsonArray>(
    path: string,
    data: T,
): Promise<void> {
    await ensureDir(dirname(path));
    await writeFile(path, JSON.stringify(data, null, 4));
}

export async function appendJson<T extends JsonObject | JsonArray>(
    path: string,
    data: T,
): Promise<void> {
    let currentJson = await readJson(path);
    if (typeof currentJson !== 'object') {
        currentJson = [currentJson];
    }

    let withAppendedData: JsonObject | JsonArray;
    if (Array.isArray(currentJson) && Array.isArray(data)) {
        withAppendedData = [
            ...currentJson,
            ...data,
        ];
    } else if (
        typeof currentJson === 'object' &&
        !Array.isArray(currentJson) &&
        typeof data === 'object' &&
        !Array.isArray(data)
    ) {
        withAppendedData = {
            ...currentJson,
            ...data,
        };
    } else {
        const currentType: string = typeOfWithArray(currentJson);
        const dataType: string = typeOfWithArray(data);
        throw new Error(
            `Type mismatch between new JSON data to append and current JSON data at "${path}": current file is "${currentType}" and data is "${dataType}"`,
        );
    }

    await writeJson(path, withAppendedData);
}
