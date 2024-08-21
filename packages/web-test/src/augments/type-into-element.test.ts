import {assert, AssertionError, waitUntil} from '@augment-vir/assert';
import {DeferredPromise, wrapPromiseInTimeout} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {extractElementText} from '@augment-vir/web';
import {fixture} from '@open-wc/testing';
import {html} from 'element-vir';
import {deleteAllTextInInput, typeString, typeStringIntoElement} from './type-into-element.js';

describe(typeString.name, () => {
    it('types into the window', async () => {
        const deferredEvent = new DeferredPromise<KeyboardEvent>();

        const windowListener = (event: KeyboardEvent) => {
            deferredEvent.resolve(event);
            window.removeEventListener('keydown', windowListener);
        };

        window.addEventListener('keydown', windowListener);

        await typeString('h');

        const keyboardEvent = await wrapPromiseInTimeout({seconds: 5}, deferredEvent.promise);

        assert.strictEquals(keyboardEvent.key, 'h');
    });
});

describe(typeStringIntoElement.name, () => {
    it('types into a specific element', async () => {
        const element = await fixture(html`
            <input />
        `);

        assert.instanceOf(element, HTMLInputElement);

        await typeStringIntoElement('hello there', element);

        await waitUntil.strictEquals('hello there', () => extractElementText(element));
    });
    it('fails if focus cannot be achieved', async () => {
        const element = await fixture(html`
            <input disabled />
        `);

        assert.instanceOf(element, HTMLInputElement);

        await assert.throws(typeStringIntoElement('hello there', element), {
            matchConstructor: AssertionError,
            matchMessage: 'times to focus the given input element.',
        });
    });
});

describe(deleteAllTextInInput.name, () => {
    it('deletes input text', async () => {
        const element = await fixture(html`
            <input value="hello there" />
        `);

        assert.instanceOf(element, HTMLInputElement);
        assert.strictEquals(extractElementText(element), 'hello there');

        await deleteAllTextInInput(element);

        await waitUntil.strictEquals('', () => extractElementText(element));
    });
    it('errors if keystrokes are blocked', async () => {
        const element = await fixture(html`
            <input value="hello there" />
        `);

        assert.instanceOf(element, HTMLInputElement);
        assert.strictEquals(extractElementText(element), 'hello there');
        element.addEventListener('keydown', (event) => {
            event.preventDefault();
        });

        await assert.throws(deleteAllTextInInput(element));
        assert.strictEquals(extractElementText(element), 'hello there');
    });
    it('errors if value gets longer', async () => {
        const element = await fixture(html`
            <input value="hello there" />
        `);

        assert.instanceOf(element, HTMLInputElement);
        assert.strictEquals(extractElementText(element), 'hello there');
        element.addEventListener('keydown', (event) => {
            event.preventDefault();
            element.value = 'hello there some more';
        });

        await assert.throws(deleteAllTextInInput(element));
        assert.strictEquals(extractElementText(element), 'hello there some more');
    });
});
