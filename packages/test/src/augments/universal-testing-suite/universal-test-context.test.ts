import {assert} from '@augment-vir/assert';
import {RuntimeEnv} from '@augment-vir/common';
import {describe} from './universal-describe.js';
import {it} from './universal-it.js';
import {
    assertTestContext,
    extractTestName,
    NodeTestContext,
    type UniversalTestContext,
} from './universal-test-context.js';

describe(assertTestContext.name, () => {
    it('guards test context', () => {
        const fakeContext: UniversalTestContext = {diagnostic: ''} as any;

        assertTestContext(fakeContext, RuntimeEnv.Node);

        assert.tsType(fakeContext).equals<NodeTestContext>();
    });
});

describe(extractTestName.name, () => {
    it('extracts test name for node and web', (testContext) => {
        assert.strictEquals(
            extractTestName(testContext),
            'extractTestName > extracts test name for node and web',
        );
    });
});
