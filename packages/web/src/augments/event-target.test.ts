import {assert, waitUntil} from '@augment-vir/assert';
import {describe, it, testWeb} from '@augment-vir/test';
import {html, listen} from 'element-vir';
import {extractEventTarget} from './event-target.js';

describe(extractEventTarget.name, () => {
    it('extracts the event target', async () => {
        let clickCount = 0;

        const fixture = await testWeb.render(html`
            <button
                ${listen('click', (event) => {
                    const target = extractEventTarget(event, HTMLButtonElement);

                    assert.tsType(target).equals<HTMLButtonElement>();

                    assert.throws(() => {
                        extractEventTarget(event, HTMLDivElement);
                    });

                    clickCount++;
                })}
            >
                Click me
            </button>
        `);

        await testWeb.click(fixture);

        await waitUntil.isAbove(0, () => {
            return clickCount;
        });
    });
    it('extracts the current event target', async () => {
        let clickCount = 0;

        const fixture = await testWeb.render(html`
            <div
                ${listen('click', (event) => {
                    const currentTarget = extractEventTarget(event, HTMLDivElement, {
                        useOriginalTarget: false,
                    });
                    const target = extractEventTarget(event, HTMLButtonElement, {
                        useOriginalTarget: true,
                    });

                    assert.tsType(currentTarget).equals<HTMLDivElement>();
                    assert.tsType(target).equals<HTMLButtonElement>();

                    assert.throws(() => {
                        extractEventTarget(event, HTMLButtonElement, {useOriginalTarget: false});
                    });
                    assert.throws(() => {
                        extractEventTarget(event, HTMLDivElement, {useOriginalTarget: true});
                    });

                    clickCount++;
                })}
            >
                <button>Click me</button>
            </div>
        `);

        const innerButton = fixture.querySelector('button');

        assert.instanceOf(innerButton, HTMLButtonElement);

        await testWeb.click(innerButton);

        await waitUntil.isAbove(0, () => {
            return clickCount;
        });
    });

    it('restricts the expected class type', () => {
        const testEvent = new CustomEvent('test-event');
        assert.throws(() => {
            // @ts-expect-error: RegExp is not a valid event target because event targets must be elements
            extractEventTarget(testEvent, RegExp);
        });
    });
});
