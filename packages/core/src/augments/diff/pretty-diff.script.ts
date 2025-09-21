import {prettyDiff} from './pretty-diff.js';
import {mockPrettyDiffTestCases} from './pretty-diff.mock.js';

mockPrettyDiffTestCases.forEach((testCase) => {
    console.info('================================');
    console.info(testCase.it);
    console.info(prettyDiff(...testCase.inputs));
});
