import {assert} from '@augment-vir/assert';
import {RuntimeEnv} from '@augment-vir/common';
import {describe} from './universal-describe.js';
import {it} from './universal-it.js';
import {
    assertTestContext,
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
