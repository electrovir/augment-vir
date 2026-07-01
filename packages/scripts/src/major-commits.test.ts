import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {
    findDisallowedMajorCommits,
    findMajorCommitsAfterBaseline,
    majorCommitBaselineHash,
} from './major-commits.js';

describe(findMajorCommitsAfterBaseline.name, () => {
    const baselineHash = 'baseline00000000000000000000000000000000';
    const gitLogOutput = [
        'aaa11111111111111111111111111111111111111\t[minor] add a feature',
        'bbb22222222222222222222222222222222222222\t[major] a new breaking change',
        'ccc33333333333333333333333333333333333333\t[patch] fix a bug',
        `${baselineHash}\t[patch] the baseline commit`,
        'ddd44444444444444444444444444444444444444\t[major] an old, grandfathered breaking change',
    ].join('\n');

    it('detects [major] commits created after the baseline', () => {
        assert.deepEquals(
            findMajorCommitsAfterBaseline({
                gitLogOutput,
                baselineHash,
            }),
            [
                {
                    hash: 'bbb22222222222222222222222222222222222222',
                    subject: '[major] a new breaking change',
                },
            ],
        );
    });

    it('ignores [major] commits at or before the baseline', () => {
        const output = [
            `${baselineHash}\t[patch] the baseline commit`,
            'ddd44444444444444444444444444444444444444\t[major] an old breaking change',
        ].join('\n');

        assert.deepEquals(
            findMajorCommitsAfterBaseline({
                gitLogOutput: output,
                baselineHash,
            }),
            [],
        );
    });

    it('checks all reachable commits when the baseline is absent (shallow clone)', () => {
        assert.deepEquals(
            findMajorCommitsAfterBaseline({
                gitLogOutput: 'bbb22222222222222222222222222222222222222\t[major] breaking',
                baselineHash,
            }),
            [
                {
                    hash: 'bbb22222222222222222222222222222222222222',
                    subject: '[major] breaking',
                },
            ],
        );
    });
});

describe(findDisallowedMajorCommits.name, () => {
    it('finds no [major] commits after the baseline', async () => {
        assert.deepEquals(
            await findDisallowedMajorCommits(),
            [],
            `New [major] commits are not allowed after ${majorCommitBaselineHash}: @augment-vir can no longer have breaking changes.`,
        );
    });
});
