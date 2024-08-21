import {DeferredPromise, wrapPromiseInTimeout} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {fixture} from '@open-wc/testing';
import {html, listen} from 'element-vir';
import {clickElement, moveToElement} from './click-element.js';

describe(clickElement.name, () => {
    it('clicks an element', async () => {
        const deferredClick = new DeferredPromise<void>();

        const element = await fixture(html`
            <button ${listen('click', () => deferredClick.resolve())}></button>
        `);

        await clickElement(element);

        await wrapPromiseInTimeout({seconds: 5}, deferredClick.promise);
    });
});

describe(moveToElement.name, () => {
    it('moves to an element', async () => {
        const deferredMove = new DeferredPromise<void>();

        const element = await fixture(html`
            <button
                ${listen('mouseenter', (event) => {
                    deferredMove.resolve();
                })}
            ></button>
        `);

        await moveToElement(element);

        await wrapPromiseInTimeout({seconds: 5}, deferredMove.promise);
    });
});
