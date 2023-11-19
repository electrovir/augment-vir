import {
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
import {getRunTimeType, isRunTimeType} from 'run-time-assertions';

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
    newData: T,
    options?: WriteJsonOptions | undefined,
): Promise<void> {
    const fileJson = await readJson(path);
    if (fileJson === undefined) {
        const writeAllData = typeof newData === 'object' ? newData : [newData];

        await writeJson(path, writeAllData, options);

        return;
    }

    const currentJson = typeof fileJson === 'object' ? fileJson : [fileJson];

    let withAppendedData: JsonCompatibleObject | JsonCompatibleArray;

    if (isRunTimeType(currentJson, 'array') && isRunTimeType(newData, 'array')) {
        withAppendedData = [
            ...currentJson,
            ...newData,
        ];
    } else if (isRunTimeType(currentJson, 'object') && isRunTimeType(newData, 'object')) {
        withAppendedData = {
            ...currentJson,
            ...newData,
        };
    } else {
        throw new Error(
            `Type mismatch between new JSON data to append and current JSON data at "${path}": current file is "${getRunTimeType(
                currentJson,
            )}" and new data is "${getRunTimeType(newData)}"`,
        );
    }

    await writeJson(path, withAppendedData, options);
}
