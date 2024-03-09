import {clickElement} from '@augment-vir/browser-testing';
import {fixture as renderFixture, waitUntil} from '@open-wc/testing';
import {html, listen} from 'element-vir';
import {assertInstanceOf, assertThrows, assertTypeOf} from 'run-time-assertions';
import {extractEventTarget} from './event-target';

describe(extractEventTarget.name, () => {
    it('extracts the event target', async () => {
        let clickCount = 0;

        const fixture = await renderFixture(html`
            <button
                ${listen('click', (event) => {
                    const target = extractEventTarget(event, HTMLButtonElement);

                    assertTypeOf(target).toEqualTypeOf<HTMLButtonElement>();

                    assertThrows(() => {
                        extractEventTarget(event, HTMLDivElement);
                    });

                    clickCount++;
                })}
            >
                Click me
            </button>
        `);

        await clickElement(fixture);

        await waitUntil(() => {
            return clickCount > 0;
        });
    });
    it('extracts the current event target', async () => {
        let clickCount = 0;

        const fixture = await renderFixture(html`
            <div
                ${listen('click', (event) => {
                    const currentTarget = extractEventTarget(event, HTMLDivElement, {
                        useOriginalTarget: false,
                    });
                    const target = extractEventTarget(event, HTMLButtonElement, {
                        useOriginalTarget: true,
                    });

                    assertTypeOf(currentTarget).toEqualTypeOf<HTMLDivElement>();
                    assertTypeOf(target).toEqualTypeOf<HTMLButtonElement>();

                    assertThrows(() => {
                        extractEventTarget(event, HTMLButtonElement, {useOriginalTarget: false});
                    });
                    assertThrows(() => {
                        extractEventTarget(event, HTMLDivElement, {useOriginalTarget: true});
                    });

                    clickCount++;
                })}
            >
                <button>Click me</button>
            </div>
        `);

        const innerButton = fixture.querySelector('button');

        assertInstanceOf(innerButton, HTMLButtonElement);

        await clickElement(innerButton);

        await waitUntil(() => {
            return clickCount > 0;
        });
    });

    it('restricts the expected class type', () => {
        const testEvent = new CustomEvent('test-event');
        assertThrows(() => {
            // @ts-expect-error: RegExp is not a valid event target because event targets must be elements
            extractEventTarget(testEvent, RegExp);
        });
    });
});
