import {assert} from '@augment-vir/assert';
import {describe, it, testWeb} from '@augment-vir/test';
import {html} from 'element-vir';
import {isElementVisible} from './element-visibility.js';

describe(isElementVisible.name, () => {
    it('detects visibility', async () => {
        const element = await testWeb.render(html`
            <div>Hello there</div>
        `);
        assert.instanceOf(element, HTMLElement);
        assert.isTrue(isElementVisible(element));
    });
    it('detects invisibility', async () => {
        const element = await testWeb.render(html`
            <div style="display: none;">Hello there</div>
        `);
        assert.instanceOf(element, HTMLElement);
        assert.isFalse(isElementVisible(element));
    });
});
