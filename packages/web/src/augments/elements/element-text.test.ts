import {assert} from '@augment-vir/assert';
import {describe, it, itCases, testWeb} from '@augment-vir/test';
import {defineElementNoInputs, html, type HTMLTemplateResult} from 'element-vir';
import {extractElementText} from './element-text.js';

describe(extractElementText.name, () => {
    async function testExtractElementText(template: HTMLTemplateResult): Promise<string> {
        const element = await testWeb.render(template);
        return extractElementText(element);
    }

    itCases(testExtractElementText, [
        {
            it: 'extracts from an input',
            input: html`
                <input value="hello" />
            `,
            expect: 'hello',
        },
        {
            it: 'extracts from text',
            input: html`
                <div>hello</div>
            `,
            expect: 'hello',
        },
        {
            it: 'extracts nested text',
            input: html`
                <div>
                    hello
                    <span>there</span>
                </div>
            `,
            expect: 'hello\n                    there',
        },
        {
            it: 'falls back to empty string',
            input: html`
                <div></div>
            `,
            expect: '',
        },
    ]);

    it('handles a shadow root', async () => {
        const TestElement = defineElementNoInputs({
            tagName: 'vir-test-extract-element-text',
            renderCallback() {
                return html`
                    inside the shadow
                `;
            },
        });
        const rendered = await testWeb.render(html`
            <${TestElement}></${TestElement}>
        `);

        assert.strictEquals(extractElementText(rendered), 'inside the shadow');
    });
});
