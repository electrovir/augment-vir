import {itCases} from '@augment-vir/browser-testing';
import {fixture as renderFixture} from '@open-wc/testing';
import {HTMLTemplateResult, defineElementNoInputs, html} from 'element-vir';
import {ChildrenQuery, queryChildren} from './query-children';
import {toTagOrDefinition} from './tag-or-definition';

async function runQueryTest(templateToTest: HTMLTemplateResult, query: ChildrenQuery) {
    const rendered = await renderFixture(templateToTest);
    const queryOutput = queryChildren(rendered, query);

    return queryOutput.map(toTagOrDefinition);
}

const TestElement = defineElementNoInputs({
    tagName: 'test-element',
    renderCallback() {
        return html`
            <article class="grab-me">test element insides</article>
        `;
    },
});

describe(queryChildren.name, () => {
    itCases(runQueryTest, [
        {
            it: 'finds an element by an pseudo class query',
            inputs: [
                html`
                    <section><div></div></section>
                `,
                ':first-child',
            ],
            expect: ['div'],
        },
        {
            it: 'finds multiple children that match a query',
            inputs: [
                html`
                    <section>
                        <div class="grab-me"><input class="grab-me" /></div>
                        <span class="grab-me"></span>
                        <${TestElement}></${TestElement}>
                        <p class="not-me"></p>
                    </section>
                `,
                '.grab-me',
            ],
            expect: [
                'div',
                'input',
                'span',
                'article',
            ],
        },
        {
            it: 'can use a definition to query children',
            inputs: [
                html`
                    <section>
                        <div class="grab-me"><input class="grab-me" /></div>
                        <span class="grab-me"></span>
                        <${TestElement}></${TestElement}>
                        <p class="not-me"></p>
                    </section>
                `,
                TestElement,
            ],
            expect: [
                TestElement,
            ],
        },
        {
            it: 'returns an empty array if the query matches nothing',
            inputs: [
                html`
                    <section>
                        <div class="grab-me"><input class="grab-me" /></div>
                        <span class="grab-me"></span>
                        <${TestElement}></${TestElement}>
                        <p class="not-me"></p>
                    </section>
                `,
                '.not-gonna-find-me',
            ],
            expect: [],
        },
    ]);
});
