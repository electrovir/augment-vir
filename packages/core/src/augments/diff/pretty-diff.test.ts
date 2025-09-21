import {describe, snapshotCases} from '@augment-vir/test';
import {prettyDiff} from './pretty-diff.js';
import {mockPrettyDiffTestCases} from './pretty-diff.mock.js';

describe(prettyDiff.name, () => {
    snapshotCases(prettyDiff, mockPrettyDiffTestCases);
});
