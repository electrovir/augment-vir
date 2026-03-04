import {assert} from '@augment-vir/assert';
import {describe, it, testWeb} from '@augment-vir/test';
import {defineElement, html} from 'element-vir';
import {findMatchingAncestor, getParentElement} from './element-parent.js';
import {queryThroughShadow} from './query-through-shadow.js';

describe(getParentElement.name, () => {
    it('works on a shadow root', async () => {
        const TestElement = defineElement()({
            tagName: 'test-element-for-get-parent-element',
            render() {
                return 'hi';
            },
        });

        const parent = await testWeb.render(html`
            <div>
                <${TestElement}></${TestElement}>
            </div>
        `);

        assert.instanceOf(parent, HTMLDivElement);
        const child = parent.querySelector(TestElement.tagName);
        assert.instanceOf(child, TestElement);

        assert.strictEquals(getParentElement(child.shadowRoot), child);
    });

    it('works on an ordinary div', async () => {
        const parent = await testWeb.render(html`
            <div>
                <div class="child"></div>
            </div>
        `);

        assert.instanceOf(parent, HTMLDivElement);
        const child = parent.querySelector('.child');
        assert.instanceOf(child, HTMLDivElement);

        assert.strictEquals(getParentElement(child), parent);
    });

    it('returns undefined when there is no parent', () => {
        assert.isUndefined(getParentElement(document.documentElement));
        assert.isUndefined(getParentElement(document));
    });
});

describe(findMatchingAncestor.name, () => {
    it('finds matching parent', async () => {
        const TestElement = defineElement()({
            tagName: 'test-element-for-find-matching-parent-element',
            render() {
                return html`
                    <slot></slot>
                `;
            },
        });

        const parent = await testWeb.render(html`
            <div class="top-parent">
                <${TestElement}>
                    <div><div class="deep-child"></div></div>
                </${TestElement}>
            </div>
        `);

        const deepChild = queryThroughShadow(parent, '.deep-child', {
            all: true,
        })[0];

        assert.instanceOf(deepChild, HTMLDivElement);

        assert.strictEquals(
            findMatchingAncestor(deepChild, (parent) => parent.classList.contains('top-parent')),
            parent,
        );
    });
    it('gets all elements in the chain', async () => {
        const TestElement = defineElement()({
            tagName: 'test-element-for-get-parent-element-2',
            render() {
                return html`
                    <div class="start-here"></div>
                `;
            },
        });

        const fixture = await testWeb.render(html`
            <div>
                <${TestElement}></${TestElement}>
            </div>
        `);

        assert.instanceOf(fixture, HTMLDivElement);
        const startHere = queryThroughShadow(fixture, '.start-here');
        assert.instanceOf(startHere, HTMLDivElement);

        const elementTags: string[] = [];

        /** The callback never returns `true` so this should return `undefined`. */
        assert.isUndefined(
            findMatchingAncestor(startHere, (element) => {
                elementTags.push(element.tagName.toLowerCase());

                return false;
            }),
        );

        assert.deepEquals(elementTags, [
            'div',
            TestElement.tagName,
            'div',
            'div',
            'body',
            'html',
        ]);
    });

    it('finds no matching parent', async () => {
        const instance = await testWeb.render(html`
            <div></div>
        `);

        assert.instanceOf(instance, HTMLDivElement);

        assert.isUndefined(
            findMatchingAncestor(instance, (parent) => parent.classList.contains('top-parent')),
        );
    });
});
