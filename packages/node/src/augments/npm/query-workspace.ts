import type {UnknownObject} from '@augment-vir/core';
import type {PackageJson} from 'type-fest';
import {runShellCommand} from '../shell.js';

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
