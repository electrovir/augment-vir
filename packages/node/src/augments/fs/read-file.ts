import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';

/**
 * Reads a file if it exists, or just return `undefined`.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @returns The file contents as a string if the file exists, otherwise `undefined`.
 * @package @augment-vir/node
 */
export async function readFileIfExists(path: string): Promise<string | undefined> {
    if (existsSync(path)) {
        return (await readFile(path)).toString();
    } else {
        return undefined;
    }
}
