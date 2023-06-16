import {assertThrows, assertTypeOf, clickElement} from '@augment-vir/browser-testing';
import {fixture as renderFixture, waitUntil} from '@open-wc/testing';
import {html, listen} from 'element-vir';
import {extractEventTarget} from './event-target';

describe(extractEventTarget.name, () => {
    it('extracts the event target', async () => {
        let clickCount = 0;

        const fixture = await renderFixture(
            html`
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
            `,
        );

        await clickElement(fixture);

        await waitUntil(() => {
            return clickCount > 0;
        });
    });

    it('restricts the expected class type', () => {
        const testEvent = new CustomEvent('test-event');
        assertThrows(() => {
            // RegExp is not a valid event target cause even targets must be elements
            // @ts-expect-error
            extractEventTarget(testEvent, RegExp);
        });
    });
});
