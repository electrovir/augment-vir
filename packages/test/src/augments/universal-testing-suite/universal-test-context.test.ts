import {assert} from '@augment-vir/assert';
import {describe} from './universal-describe.js';
import {it} from './universal-it.js';
import {
    assertTestContext,
    extractTestName,
    extractTestNameAsDir,
    TestEnv,
    type NodeTestContext,
    type UniversalTestContext,
} from './universal-test-context.js';

describe(assertTestContext.name, () => {
    it('guards test context', () => {
        const fakeContext: UniversalTestContext = {
            diagnostic: '',
        } as any;

        assertTestContext(fakeContext, TestEnv.Node);

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

describe(extractTestNameAsDir.name, () => {
    it('extracts safe test name for node and web', (testContext) => {
        assert.strictEquals(
            extractTestNameAsDir(testContext),
            'extract_test_name_as_dir_extracts_safe_test_name_for_node_and_web',
        );
    });
});
