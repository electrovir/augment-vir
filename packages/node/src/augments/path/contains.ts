import {type PartialWithUndefined} from '@augment-vir/common';
import {isAbsolute, normalize, relative, resolve, sep} from 'node:path';
import {isOperatingSystem, OperatingSystem} from '../os/operating-system.js';

/**
 * Checks to see if a potential child path is inside of a potential parent path.
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function doesPathContain(
    potentialParentPath: string,
    potentialChildPath: string,
    options: PartialWithUndefined<{
        /**
         * Set this to `true` to return `true` if the paths are exactly equal.
         *
         * @default false
         */
        allowSelf: boolean;
    }> = {},
): boolean {
    if (!potentialParentPath || !potentialChildPath) {
        return false;
    }

    const parent = normalizePath(potentialParentPath);
    const child = normalizePath(potentialChildPath);

    const relativePath = relative(parent, child);

    if (!relativePath) {
        /** Paths are identical. */
        return !!options.allowSelf;
        /* node:coverage ignore next 4: cannot test Windows specific behavior on all systems. */
    } else if (isAbsolute(relativePath)) {
        /** On Windows, paths on different drives yield an absolute relative path. */
        return false;
    }

    /** Contained if it does not traverse up out of parent. */
    return relativePath !== '..' && !relativePath.startsWith('..' + sep);
}

function normalizePath(inputPath: string): string {
    const absolutePath = normalize(resolve(inputPath));

    /* node:coverage ignore next 1: cannot test Windows specific behavior on all systems. */
    return isOperatingSystem(OperatingSystem.Windows) ? absolutePath.toLowerCase() : absolutePath;
}
