import {assert, AssertionError, waitUntil} from '@augment-vir/assert';
import {DeferredPromise, wrapPromiseInTimeout} from '@augment-vir/common';
import {html} from 'element-vir';
import {describe} from '../universal-testing-suite/universal-describe.js';
import {it} from '../universal-testing-suite/universal-it.js';
import {testWeb} from './index.js';

describe(testWeb.type.name, () => {
    it('types into the window', async () => {
        const deferredEvent = new DeferredPromise<KeyboardEvent>();

        const windowListener = (event: KeyboardEvent) => {
            deferredEvent.resolve(event);
            window.removeEventListener('keydown', windowListener);
        };

        window.addEventListener('keydown', windowListener);

        await testWeb.type('h');

        const keyboardEvent = await wrapPromiseInTimeout({seconds: 5}, deferredEvent.promise);

        assert.strictEquals(keyboardEvent.key, 'h');
    });
});

describe(testWeb.typeIntoInput.name, () => {
    it('types into a specific element', async () => {
        const element = await testWeb.render(html`
            <input />
        `);

        assert.instanceOf(element, HTMLInputElement);

        await testWeb.typeIntoInput('hello there', element);

        await waitUntil.strictEquals('hello there', () => element.value);
    });
    it('fails if focus cannot be achieved', async () => {
        const element = await testWeb.render(html`
            <input disabled />
        `);

        assert.instanceOf(element, HTMLInputElement);

        await assert.throws(testWeb.typeIntoInput('hello there', element), {
            matchConstructor: AssertionError,
            matchMessage: 'times to focus the given input element.',
        });
    });
});

describe(testWeb.deleteInputText.name, () => {
    it('deletes input text', async () => {
        const element = await testWeb.render(html`
            <input value="hello there" />
        `);

        assert.instanceOf(element, HTMLInputElement);
        assert.strictEquals(element.value, 'hello there');

        await testWeb.deleteInputText(element);

        await waitUntil.strictEquals('', () => element.value);
    });
    it('errors if keystrokes are blocked', async () => {
        const element = await testWeb.render(html`
            <input value="hello there" />
        `);

        assert.instanceOf(element, HTMLInputElement);
        assert.strictEquals(element.value, 'hello there');
        element.addEventListener('keydown', (event) => {
            event.preventDefault();
        });

        await assert.throws(testWeb.deleteInputText(element));
        assert.strictEquals(element.value, 'hello there');
    });
    it('errors if value gets longer', async () => {
        const element = await testWeb.render(html`
            <input value="hello there" />
        `);

        assert.instanceOf(element, HTMLInputElement);
        assert.strictEquals(element.value, 'hello there');
        element.addEventListener('keydown', (event) => {
            event.preventDefault();
            element.value = 'hello there some more';
        });

        await assert.throws(testWeb.deleteInputText(element));
        assert.strictEquals(element.value as string, 'hello there some more');
    });
});
