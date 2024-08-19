import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';

export async function readFileIfExists(path: string): Promise<string | undefined> {
    if (existsSync(path)) {
        return (await readFile(path)).toString();
    } else {
        return undefined;
    }
}
