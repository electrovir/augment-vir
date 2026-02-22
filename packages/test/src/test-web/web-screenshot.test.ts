import {describe, it, testWeb} from '@augment-vir/test';
import {html} from 'element-vir';
import {assertWebScreenshot} from './web-screenshot.js';

describe(assertWebScreenshot.name, () => {
    it('creates a screenshot', async (testContext) => {
        const fixture = await testWeb.render(html`
            <div>Hi!</div>
        `);

        await assertWebScreenshot(fixture, testContext);
    });
});
