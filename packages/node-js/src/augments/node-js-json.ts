import {
    getRuntimeTypeOf,
    JsonCompatibleArray,
    JsonCompatibleObject,
    JsonCompatibleValue,
    parseJson,
    PartialAndNullable,
} from '@augment-vir/common';
import {existsSync} from 'fs';
import {ensureDir} from 'fs-extra';
import {readFile, writeFile} from 'fs/promises';
import {dirname} from 'path';

export async function readJson<ParsedJsonType extends JsonCompatibleValue = JsonCompatibleValue>(
    path: string,
    options: {
        shapeMatcher?: ParsedJsonType | undefined;
        throwErrors?: boolean | undefined;
    } = {},
): Promise<ParsedJsonType | undefined> {
    if (!existsSync(path) && !options.throwErrors) {
        return undefined;
    }

    const contents = (await readFile(path)).toString();
    const json = parseJson({
        jsonString: contents,
        shapeMatcher: options.shapeMatcher,
        errorHandler: (error) => {
            if (options.throwErrors) {
                throw error;
            } else {
                return undefined;
            }
        },
    });
    return json;
}

export type WriteJsonOptions = PartialAndNullable<{
    includeTrailingNewLine: boolean;
}>;

export async function writeJson<T extends JsonCompatibleObject | JsonCompatibleArray>(
    path: string,
    data: T,
    options?: WriteJsonOptions | undefined,
): Promise<void> {
    await ensureDir(dirname(path));

    const trailingNewLine = options?.includeTrailingNewLine ? '\n' : '';

    await writeFile(path, JSON.stringify(data, null, 4) + trailingNewLine);
}

export async function appendJson<T extends JsonCompatibleObject | JsonCompatibleArray>(
    path: string,
    data: T,
    options?: WriteJsonOptions | undefined,
): Promise<void> {
    let currentJson = await readJson(path);
    if (typeof currentJson !== 'object') {
        currentJson = [currentJson];
    }

    let withAppendedData: JsonCompatibleObject | JsonCompatibleArray;
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
        const currentType: string = getRuntimeTypeOf(currentJson);
        const dataType: string = getRuntimeTypeOf(data);
        throw new Error(
            `Type mismatch between new JSON data to append and current JSON data at "${path}": current file is "${currentType}" and data is "${dataType}"`,
        );
    }

    await writeJson(path, withAppendedData, options);
}
