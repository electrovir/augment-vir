import {ensureDir} from 'fs-extra';
import {readFile, writeFile} from 'fs/promises';
import {dirname} from 'path';

export async function readJson<T extends object = any>(path: string): Promise<T> {
    try {
        const json = JSON.parse((await readFile(path)).toString());
        return json;
    } catch (error) {
        return {} as T;
    }
}

export async function writeJson<T extends object = any>(path: string, data: T): Promise<void> {
    await ensureDir(dirname(path));
    await writeFile(path, JSON.stringify(data, null, 4));
}

export async function appendJson<T extends object = any>(path: string, data: T): Promise<void> {
    const currentJson = await readJson(path);
    const withAppendedData = {...currentJson, ...data};
    await writeJson(path, withAppendedData);
}
