import {assert} from '@augment-vir/assert';
import {describe} from './universal-describe.js';
import {it} from './universal-it.js';
import {assertTestContext, TestEnv} from './universal-test-context.js';

describe('playwright detection', () => {
    it('does not work on non-playwright tests', (testContext) => {
        /** `process` is undefined on the web. */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        assert.isUndefined(globalThis.process?.env.PLAYWRIGHT_TEST);

        assert.throws(() => assertTestContext(testContext, TestEnv.Playwright));
    });
});
