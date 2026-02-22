import {assert} from '@augment-vir/assert';
import {describe} from './augments/universal-testing-suite/universal-describe.js';
import {it} from './augments/universal-testing-suite/universal-it.js';
import {
    assertTestContext,
    extractTestNameAsDir,
    TestEnv,
} from './augments/universal-testing-suite/universal-test-context.js';

describe('index.ts', () => {
    it('can be imported in a browser', async (testContext) => {
        assertTestContext(testContext, TestEnv.Web);

        await import('./index.js');

        assert.isString(extractTestNameAsDir(testContext));
    });
});
