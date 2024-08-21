import {DeferredPromise, wrapPromiseInTimeout} from '@augment-vir/common';
import {html, listen} from 'element-vir';
import {describe} from '../universal-testing-suite/universal-describe.js';
import {it} from '../universal-testing-suite/universal-it.js';
import {testWeb} from './index.js';

describe(testWeb.click.name, () => {
    it('clicks an element', async () => {
        const deferredClick = new DeferredPromise<void>();

        const element = await testWeb.render(html`
            <button ${listen('click', () => deferredClick.resolve())}></button>
        `);

        await testWeb.click(element);

        await wrapPromiseInTimeout({seconds: 5}, deferredClick.promise);
    });
});

describe(testWeb.moveMouseTo.name, () => {
    it('moves to an element', async () => {
        const deferredMove = new DeferredPromise<void>();

        const element = await testWeb.render(html`
            <button
                ${listen('mouseenter', (event) => {
                    deferredMove.resolve();
                })}
            ></button>
        `);

        await testWeb.moveMouseTo(element);

        await wrapPromiseInTimeout({seconds: 5}, deferredMove.promise);
    });
});
