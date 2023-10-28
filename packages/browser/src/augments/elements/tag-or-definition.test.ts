import {itCases} from '@augment-vir/browser-testing';
import {fixture as renderFixture} from '@open-wc/testing';
import {defineElementNoInputs, html} from 'element-vir';
import {ChildrenQuery, queryChildren} from './query-children';
import {toTagOrDefinition} from './tag-or-definition';

const TestElement = defineElementNoInputs({
    tagName: 'test-element',
    renderCallback() {
        return html`
            <div>test element insides</div>
        `;
    },
});

async function runToTagOrDefinitionTest(query: ChildrenQuery) {
    const rendered = await renderFixture(html`
        <section>
            <${TestElement}></${TestElement}>
            <div></div>
            <span class="my-span"></span>
        </section>
    `);
    const foundChild = queryChildren(rendered, query)[0];

    if (!foundChild) {
        throw new Error(`Found no children by query: ${query}`);
    }

    return toTagOrDefinition(foundChild);
}

describe(toTagOrDefinition.name, () => {
    itCases(runToTagOrDefinitionTest, [
        {
            it: 'maps an element to its tag name',
            input: 'div',
            expect: 'div',
        },
        {
            it: 'maps an element to its tag name via a different query',
            input: '.my-span',
            expect: 'span',
        },
        {
            it: 'maps a declarative element instance to its definition',
            input: TestElement.tagName,
            expect: TestElement,
        },
    ]);
});
