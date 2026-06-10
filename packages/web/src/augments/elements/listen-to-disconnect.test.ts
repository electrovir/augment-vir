import {assert, waitUntil} from '@augment-vir/assert';
import {wait} from '@augment-vir/common';
import {describe, it, testWeb} from '@augment-vir/test';
import {html} from 'element-vir';
import {listenToElementDisconnect} from './listen-to-disconnect.js';

describe(listenToElementDisconnect.name, () => {
    it('fires the listener when the element is disconnected', async () => {
        const element = await testWeb.render(html`
            <div>disconnect me</div>
        `);
        assert.instanceOf(element, HTMLDivElement);

        let callCount = 0;
        listenToElementDisconnect(element, () => {
            callCount++;
        });

        assert.strictEquals(callCount, 0);

        element.remove();

        await waitUntil.strictEquals(1, () => callCount);
    });

    it('fires immediately when the element is already disconnected', () => {
        const element = document.createElement('div');
        assert.isFalse(element.isConnected);

        let callCount = 0;
        listenToElementDisconnect(element, () => {
            callCount++;
        });

        assert.strictEquals(callCount, 1);
    });

    it('returns a cleanup function that stops listening', async () => {
        const element = await testWeb.render(html`
            <div>keep me</div>
        `);
        assert.instanceOf(element, HTMLDivElement);

        let callCount = 0;
        const stopListening = listenToElementDisconnect(element, () => {
            callCount++;
        });

        stopListening();
        element.remove();

        await wait({
            milliseconds: 100,
        });

        assert.strictEquals(callCount, 0);
    });

    it('does not fire when a different element is disconnected', async () => {
        const parent = await testWeb.render(html`
            <div>
                <div class="watched"></div>
                <div class="other"></div>
            </div>
        `);
        assert.instanceOf(parent, HTMLDivElement);

        const watched = parent.querySelector('.watched');
        const other = parent.querySelector('.other');
        assert.instanceOf(watched, HTMLDivElement);
        assert.instanceOf(other, HTMLDivElement);

        let callCount = 0;
        listenToElementDisconnect(watched, () => {
            callCount++;
        });

        other.remove();
        await wait({
            milliseconds: 100,
        });
        assert.strictEquals(callCount, 0);

        watched.remove();
        await waitUntil.strictEquals(1, () => callCount);
    });

    it('only fires the listener once after disconnect', async () => {
        const parent = await testWeb.render(html`
            <div>
                <div class="watched"></div>
            </div>
        `);
        assert.instanceOf(parent, HTMLDivElement);

        const watched = parent.querySelector('.watched');
        assert.instanceOf(watched, HTMLDivElement);

        let callCount = 0;
        listenToElementDisconnect(watched, () => {
            callCount++;
        });

        watched.remove();
        await waitUntil.strictEquals(1, () => callCount);

        /** Trigger more mutations on the body to ensure the observer has stopped observing. */
        const extra = document.createElement('span');
        document.body.append(extra);
        await wait({
            milliseconds: 100,
        });
        extra.remove();

        assert.strictEquals(callCount, 1);
    });
});
