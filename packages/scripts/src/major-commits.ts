import {filterMap} from '@augment-vir/common';
import {runShellCommand} from '@augment-vir/node';
import {monoRepoDirPath} from './file-paths.js';

/**
 * The latest commit that is allowed to be a `[major]` (breaking change) version bump. Every commit
 * created after this baseline must _not_ be `[major]`: @augment-vir can no longer have breaking
 * changes.
 */
export const majorCommitBaselineHash = '4d01cc1b2502db68a6d48e35847dd1ab3a863e2b';

/** The commit-message prefix that `release-vir` uses to trigger a major (breaking) version bump. */
export const majorCommitPrefix = '[major]';

export type GitCommit = {
    hash: string;
    subject: string;
};

/**
 * Parses the output of `git log --format=%H%x09%s` (newest commit first, hash and subject separated
 * by a tab) into commit objects.
 */
function parseGitLog(gitLogOutput: string): GitCommit[] {
    return filterMap(
        gitLogOutput.split('\n'),
        (line) => {
            const tabIndex = line.indexOf('\t');

            return {
                hash: line.slice(0, tabIndex),
                subject: line.slice(tabIndex + 1),
            };
        },
        (commit) => !!commit.hash,
    );
}

/**
 * Given all reachable commits (newest first) and a baseline hash, returns only the commits created
 * after the baseline.
 *
 * If the baseline is not present (for example in a shallow clone that does not reach it) all given
 * commits are returned. The baseline is always newer than every historical `[major]` commit, so a
 * grandfathered `[major]` commit can never appear without the baseline also appearing.
 */
function selectCommitsAfterBaseline(
    allCommits: ReadonlyArray<GitCommit>,
    baselineHash: string,
): GitCommit[] {
    const baselineIndex = allCommits.findIndex((commit) => commit.hash === baselineHash);

    return baselineIndex === -1 ? [...allCommits] : allCommits.slice(0, baselineIndex);
}

/**
 * Given the output of `git log --format=%H%x09%s`, returns all `[major]` commits created after the
 * given baseline hash.
 */
export function findMajorCommitsAfterBaseline({
    gitLogOutput,
    baselineHash,
}: Readonly<{
    gitLogOutput: string;
    baselineHash: string;
}>): GitCommit[] {
    return selectCommitsAfterBaseline(parseGitLog(gitLogOutput), baselineHash).filter((commit) => {
        return commit.subject.startsWith(majorCommitPrefix);
    });
}

/**
 * Finds any disallowed `[major]` (breaking change) commits created after
 * {@link majorCommitBaselineHash} in the current repo.
 */
export async function findDisallowedMajorCommits(): Promise<GitCommit[]> {
    const {stdout} = await runShellCommand('git log --no-color --format=%H%x09%s', {
        cwd: monoRepoDirPath,
        rejectOnError: true,
    });

    return findMajorCommitsAfterBaseline({
        gitLogOutput: stdout,
        baselineHash: majorCommitBaselineHash,
    });
}
