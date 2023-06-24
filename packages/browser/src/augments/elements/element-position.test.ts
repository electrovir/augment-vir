import {
    assertOutput,
    typedAssertInstanceOf,
    typedAssertNotNullish,
} from '@augment-vir/browser-testing';
import {assert, fixture as renderFixture, waitUntil} from '@open-wc/testing';
import {html} from 'element-vir';
import {
    appendPositionDebugDiv,
    checkIfEntirelyInScrollView,
    getCenterOfElement,
} from './element-position';

describe(checkIfEntirelyInScrollView.name, () => {
    it('detects when elements are out of the scroll area', async () => {
        const fixture = await renderFixture(
            html`
                <div style="max-height: 100px; overflow: auto;">
                    ${Array(10)
                        .fill(0)
                        .map(() => {
                            return html`
                                <div class="child" style="height: 20px; border: 1px solid red;">
                                    stuff
                                </div>
                            `;
                        })}
                </div>
            `,
        );

        const firstElement = fixture.querySelector('.child:first-of-type');
        const lastElement = fixture.querySelector('.child:last-of-type');

        typedAssertInstanceOf(firstElement, HTMLDivElement);
        typedAssertInstanceOf(lastElement, HTMLDivElement);

        await assertOutput(checkIfEntirelyInScrollView, true, firstElement);
        await assertOutput(checkIfEntirelyInScrollView, false, lastElement);

        lastElement.scrollIntoView({behavior: 'instant'});

        await waitUntil(async () => {
            return await checkIfEntirelyInScrollView(lastElement);
        });
    });
});

describe(getCenterOfElement.name, () => {
    it('correctly gets the center', async () => {
        const fixture = await renderFixture(
            html`
                <div style="height: 100px; width: 100px;"></div>
            `,
        );

        assertOutput(getCenterOfElement, {x: 58, y: 58}, fixture);
    });
});

describe(appendPositionDebugDiv.name, () => {
    it('inserts the div', async () => {
        const fixture = await renderFixture(
            html`
                <div style="height: 100px; width: 100px;"></div>
            `,
        );

        const debugDiv = appendPositionDebugDiv(getCenterOfElement(fixture));

        function findDebugDiv() {
            return document.body.querySelector(
                [
                    '.',
                    debugDiv.className,
                ].join(''),
            );
        }

        typedAssertNotNullish(findDebugDiv(), 'failed to find the debug div');

        debugDiv.remove();
        assert.isUndefined(findDebugDiv() ?? undefined, 'debug div should have removed itself');
    });
});
