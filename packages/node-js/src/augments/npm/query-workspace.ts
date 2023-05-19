import {parseJson} from '@augment-vir/common';
import {PackageJson} from 'type-fest';
import {runShellCommand} from '../shell';

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
    queryContext: {};
    realpath: string;
    resolved: null;
    to: string[];
};

export async function queryNpmWorkspace(cwd: string): Promise<NpmWorkspace[]> {
    const queryOutput = await runShellCommand('npm query .workspace', {
        cwd,
        rejectOnError: true,
    });

    const parsedWorkspaces = parseJson<NpmWorkspace[]>({
        jsonString: queryOutput.stdout,
        errorHandler() {
            throw new Error(`Failed to read npm workspace data for '${cwd}'`);
        },
    });

    return parsedWorkspaces;
}
