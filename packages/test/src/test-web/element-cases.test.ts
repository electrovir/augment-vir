import {assert} from '@augment-vir/assert';
import {defineElement, defineElementEvent, html, listen, testId, testIdSelector} from 'element-vir';
import {testWeb} from '../augments/test-web.js';
import {describe} from '../augments/universal-testing-suite/universal-describe.js';
import {elementCases} from './element-cases.js';

const TestElement = defineElement()({
    tagName: 'test-element-cases-083i12',
    testIds: [
        'eventButton',
    ],
    events: {
        eventDispatched: defineElementEvent<string>(),
    },
    render({dispatch, events, testIds}) {
        return html`
            <button
                ${testId(testIds.eventButton)}
                ${listen('click', () => {
                    dispatch(
                        new events.eventDispatched({
                            detail: 'event detail',
                        }),
                    );
                })}
            ></button>
        `;
    },
});

describe(elementCases.name, () => {
    testWeb.elementCases(TestElement, [
        {
            it: 'captures declarative element events',
            expect: {
                events: new Map([
                    [
                        TestElement.events.eventDispatched,
                        [
                            'event detail',
                        ],
                    ],
                ]),
            },
            async act(instance) {
                const button = instance.shadowRoot.querySelector(
                    testIdSelector(TestElement.testIds.eventButton),
                );

                assert.instanceOf(button, HTMLButtonElement);

                await testWeb.click(button);
            },
        },
    ]);
});
