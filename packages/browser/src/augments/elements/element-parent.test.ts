import {assert, fixture} from '@open-wc/testing';
import {defineElementNoInputs, html} from 'element-vir';
import {assertInstanceOf} from 'run-time-assertions';
import {findMatchingParent, getParentElement} from './element-parent';
import {queryChildren} from './query-children';

describe(getParentElement.name, () => {
    it('works on a shadow root', async () => {
        const TestElement = defineElementNoInputs({
            tagName: 'test-element-for-get-parent-element',
            renderCallback() {
                return 'hi';
            },
        });

        const parent = await fixture(html`
            <div>
                <${TestElement}></${TestElement}>
            </div>
        `);

        assertInstanceOf(parent, HTMLDivElement);
        const child = parent.querySelector(TestElement.tagName);
        assertInstanceOf(child, TestElement);

        assert.strictEqual(parent, getParentElement(child.shadowRoot));
    });

    it('works on an ordinary div', async () => {
        const parent = await fixture(html`
            <div>
                <div class="child"></div>
            </div>
        `);

        assertInstanceOf(parent, HTMLDivElement);
        const child = parent.querySelector('.child');
        assertInstanceOf(child, HTMLDivElement);

        assert.strictEqual(parent, getParentElement(child));
    });

    it('returns undefined when there is no parent', async () => {
        assert.isUndefined(getParentElement(document.documentElement));
        assert.isUndefined(getParentElement(document));
    });
});

describe(findMatchingParent.name, () => {
    it('finds matching parent', async () => {
        const TestElement = defineElementNoInputs({
            tagName: 'test-element-for-find-matching-parent-element',
            renderCallback() {
                return html`
                    <slot></slot>
                `;
            },
        });

        const parent = await fixture(html`
            <div class="top-parent">
                <${TestElement}>
                    <div><div class="deep-child"></div></div>
                </${TestElement}>
            </div>
        `);

        const deepChild = queryChildren(parent, '.deep-child')[0];

        assertInstanceOf(deepChild, HTMLDivElement);

        assert.strictEqual(
            parent,
            findMatchingParent(deepChild, (parent) => parent.classList.contains('top-parent')),
        );
    });

    it('finds no matching parent', async () => {
        const instance = await fixture(html`
            <div></div>
        `);

        assertInstanceOf(instance, HTMLDivElement);

        assert.isUndefined(
            findMatchingParent(instance, (parent) => parent.classList.contains('top-parent')),
        );
    });
});
