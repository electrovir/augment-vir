/* node:coverage disable */

/** Run this script (without any args) to see what the pretty diff string printing looks like. */

import {prettyDiff} from './pretty-diff.js';
import {mockPrettyDiffTestCases} from './pretty-diff.mock.js';

mockPrettyDiffTestCases.forEach((testCase) => {
    console.info('================================');
    console.info(testCase.it);
    console.info(prettyDiff(...testCase.inputs));
});
