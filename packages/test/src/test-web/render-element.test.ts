import {assert} from '@augment-vir/assert';
import {defineElement, html} from 'element-vir';
import {testWeb} from '../augments/test-web.js';
import {describe} from '../augments/universal-testing-suite/universal-describe.js';
import {it} from '../augments/universal-testing-suite/universal-it.js';

const TestWithInputs = defineElement<{input: string}>()({
    tagName: 'test-with-inputs-093i12',
    render() {
        return html`
            hello there 1
        `;
    },
});

const TestWithoutInputs = defineElement()({
    tagName: 'test-without-inputs-093i12',
    render() {
        return html`
            hello there 2
        `;
    },
});

describe(testWeb.renderElement.name, () => {
    it('works on an element with inputs', async () => {
        const instance = await testWeb.renderElement(TestWithInputs, {
            input: 'hi',
        });
        assert.tsType(instance).equals<(typeof TestWithInputs)['InstanceType']>();
        assert.instanceOf(instance, TestWithInputs);
    });
    it('requires inputs', async () => {
        // @ts-expect-error: missing inputs
        await testWeb.renderElement(TestWithInputs);
    });
    it('works on an element without inputs', async () => {
        const instance = await testWeb.renderElement(TestWithoutInputs);
        assert.tsType(instance).equals<(typeof TestWithoutInputs)['InstanceType']>();
        assert.instanceOf(instance, TestWithoutInputs);
    });
});
