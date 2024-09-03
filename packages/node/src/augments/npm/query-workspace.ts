import type {UnknownObject} from '@augment-vir/core';
import type {PackageJson} from 'type-fest';
import {runShellCommand} from '../terminal/shell.js';

/**
 * An npm workspace object. This is the return type for {@link queryNpmWorkspace}.
 *
 * @category Node : Npm
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type NpmWorkspace = PackageJson & {
    _id: string;
    deduped: boolean;
    dev: boolean;
    from: string[];
    inBundle: boolean;
    location: string;
    overridden: boolean;
    path: string;
    pkgid: string;
    queryContext: UnknownObject;
    realpath: string;
    resolved: null;
    to: string[];
};

/**
 * Get a list of all NPM workspaces in the given mono-repo directory using npm's CLI.
 *
 * @category Node : Npm
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export async function queryNpmWorkspace(cwd: string): Promise<NpmWorkspace[]> {
    const queryOutput = await runShellCommand('npm query .workspace', {
        cwd,
        rejectOnError: true,
    });

    try {
        return JSON.parse(queryOutput.stdout);
        /* node:coverage ignore next 3 */
    } catch {
        throw new Error(`Failed to read npm workspace data for '${cwd}'`);
    }
}
