import {assert} from '@augment-vir/assert';
import {describe} from './universal-describe.js';
import {it} from './universal-it.js';
import {assertTestContext, extractTestName, TestEnv} from './universal-test-context.js';

describe('playwright detection', () => {
    it('works', (testContext) => {
        assert.isTruthy(process.env.PLAYWRIGHT_TEST);

        assertTestContext(testContext, TestEnv.Playwright);

        assert.strictEquals(
            extractTestName(testContext),
            'augments/universal-testing-suite/playwright-detection.test.e2e.ts > playwright detection > works',
        );
    });
});
