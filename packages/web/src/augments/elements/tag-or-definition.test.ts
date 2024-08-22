import {stringify} from '@augment-vir/core';
import {describe, itCases, testWeb} from '@augment-vir/test';
import {defineElementNoInputs, html} from 'element-vir';
import {queryThroughShadow} from '../query-through-shadow.js';
import {toTagOrDefinition} from './tag-or-definition.js';

const TestElement = defineElementNoInputs({
    tagName: 'test-element',
    renderCallback() {
        return html`
            <div>test element insides</div>
        `;
    },
});

async function runToTagOrDefinitionTest(query: string | {tagName: string}) {
    const rendered = await testWeb.render(html`
        <section>
            <${TestElement}></${TestElement}>
            <div></div>
            <span class="my-span"></span>
        </section>
    `);
    const foundChild = queryThroughShadow(rendered, query, {all: true})[0];

    if (!foundChild) {
        throw new Error(`Found no children by query: ${stringify(query)}`);
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
