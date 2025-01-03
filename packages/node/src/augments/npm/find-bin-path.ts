import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {findAncestor} from '../path/ancestor.js';

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
