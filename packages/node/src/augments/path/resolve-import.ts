import {check} from '@augment-vir/assert';
import {filterMap, getObjectTypedEntries} from '@augment-vir/common';
import {existsSync, realpathSync} from 'node:fs';
import {dirname, join, resolve, sep} from 'node:path';
import {ParsedCommandLine} from 'typescript';
import {readTsconfig} from '../typescript/read-tsconfig.js';
import {findAncestor} from './ancestor.js';
import {replaceWithWindowsPathIfNeeded} from './os-path.js';

/**
 * Determines the path that will be imported into the given `startingPoint` from the given
 * `importPath`. Resolves symlinks, tries to map `.js` extensions to `.ts` extensions when needed,
 * and tries to find the best `node_modules` import for package imports.
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @returns `undefined` if no matches are found.
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function resolveImportPath(
    importerFilePath: string,
    importPath: string,
): string | undefined {
    const foundTsconfig = readTsconfig(importerFilePath);

    const mappedImportPath = foundTsconfig
        ? mapImportPath(importPath, foundTsconfig.tsconfig, foundTsconfig.path)
        : importPath;

    if (mappedImportPath.startsWith(sep) || mappedImportPath.startsWith('/')) {
        /** Absolute import */

        return mapFilePath(replaceWithWindowsPathIfNeeded(mappedImportPath));
    } else if (mappedImportPath.startsWith('.')) {
        /** Relative import */
        return mapFilePath(
            resolve(dirname(importerFilePath), replaceWithWindowsPathIfNeeded(mappedImportPath)),
        );
    } else {
        /** Package import */

        const isOrgPackage = mappedImportPath.startsWith('@');
        const importPathParts = mappedImportPath.split('/');

        const packagePath: string = isOrgPackage
            ? join(...importPathParts.slice(0, 2))
            : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              importPathParts[0]!;

        const relevantNodeModulesParent = findAncestor(importerFilePath, (ancestorPath) => {
            const isMatch = existsSync(join(ancestorPath, 'node_modules', packagePath));

            return isMatch;
        });

        if (!relevantNodeModulesParent) {
            return undefined;
        }

        return mapFilePath(
            join(
                relevantNodeModulesParent,
                'node_modules',
                replaceWithWindowsPathIfNeeded(mappedImportPath),
            ),
        );
    }
}

function mapFilePath(path: string): string {
    if (existsSync(path)) {
        return realpathSync(path);
    }

    const tsPath = path.replace(/\.js$/, '.ts');

    if (path.endsWith('.js') && existsSync(tsPath)) {
        return realpathSync(tsPath);
    }

    return path;
}

function mapImportPath(
    importPath: string,
    tsconfig: ParsedCommandLine,
    tsconfigPath: string,
): string {
    const paths = tsconfig.options.paths;
    if (!paths) {
        return importPath;
    }

    const mappedPaths = filterMap(
        getObjectTypedEntries(paths),
        ([
            alias,
            paths,
        ]) => {
            const aliasRegex = new RegExp('^' + String(alias).replace(/\*/g, '(.*)') + '$');
            const match = importPath.match(aliasRegex);

            if (!match) {
                return undefined;
            }

            /** An empty paths is invalid anyway. */
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return paths[0]!.replace(/\*/g, match[1]!);
        },
        check.isTruthy,
    );

    if (!mappedPaths[0]) {
        return importPath;
    }

    return resolve(tsconfig.options.baseUrl || dirname(tsconfigPath), mappedPaths[0]);
}
