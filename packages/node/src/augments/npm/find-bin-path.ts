import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {findAncestor} from '../path/ancestor.js';

/**
 * Finds the path to an npm package executable bin by searching in all ancestor `node_modules/.bin`
 * folders, starting at the given `startPath`.
 *
 * @category Node : Npm
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function findNpmBinPath({
    binName,
    startPath,
}: {
    startPath: string;
    binName: string;
}): string | undefined {
    const binPath = join('node_modules', '.bin', binName);

    const ancestor = findAncestor(startPath, (ancestor) => {
        return existsSync(join(ancestor, binPath));
    });

    if (!ancestor) {
        return undefined;
    }

    return join(ancestor, binPath);
}
