import {mkdir, writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';

/**
 * Writes to the given file path and always ensures that the path's parent directories are all
 * created.
 *
 * @category Node : File
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function writeFileAndDir(
    path: string,
    contents: string | NodeJS.ArrayBufferView,
): Promise<void> {
    await mkdir(dirname(path), {recursive: true});
    await writeFile(path, contents);
}
