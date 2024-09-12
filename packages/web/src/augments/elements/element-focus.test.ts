import {assert} from '@augment-vir/assert';
import {describe, it, testWeb} from '@augment-vir/test';
import {html} from 'element-vir';
import {isElementFocused} from './element-focus.js';

describe(isElementFocused.name, () => {
    it('works', async () => {
        const element = await testWeb.render(html`
            <input />
        `);
        assert.isFalse(isElementFocused(element));
        await testWeb.click(element);
        assert.isTrue(isElementFocused(element));
    });
});
