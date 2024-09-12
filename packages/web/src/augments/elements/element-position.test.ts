import {assert, waitUntil} from '@augment-vir/assert';
import {describe, it, testWeb} from '@augment-vir/test';
import {html} from 'element-vir';
import {
    appendPositionDebugDiv,
    checkIfEntirelyInScrollView,
    getCenterOfElement,
} from './element-position.js';

describe(checkIfEntirelyInScrollView.name, () => {
    it('detects when elements are out of the scroll area', async () => {
        const fixture = await testWeb.render(html`
            <div style="max-height: 100px; overflow: auto;">
                ${new Array(10).fill(0).map(() => {
                    return html`
                        <div class="child" style="height: 20px; border: 1px solid red;">stuff</div>
                    `;
                })}
            </div>
        `);

        const firstElement = fixture.querySelector('.child:first-of-type');
        const lastElement = fixture.querySelector('.child:last-of-type');

        assert.instanceOf(firstElement, HTMLDivElement);
        assert.instanceOf(lastElement, HTMLDivElement);

        await assert.output(checkIfEntirelyInScrollView, [firstElement], true);
        await assert.output(checkIfEntirelyInScrollView, [lastElement], false);

        lastElement.scrollIntoView({behavior: 'instant'});

        await waitUntil.isTrue(async () => {
            return await checkIfEntirelyInScrollView(lastElement);
        });
    });
});

describe(getCenterOfElement.name, () => {
    it('correctly gets the center', async () => {
        const element = await testWeb.render(html`
            <div style="height: 100px; width: 100px;"></div>
        `);

        assert.output(getCenterOfElement, [element], {x: 58, y: 58});
    });
});

describe(appendPositionDebugDiv.name, () => {
    it('inserts the div', async () => {
        const fixture = await testWeb.render(html`
            <div style="height: 100px; width: 100px;"></div>
        `);

        const debugDiv = appendPositionDebugDiv(getCenterOfElement(fixture));

        function findDebugDiv() {
            return document.body.querySelector(
                [
                    '.',
                    debugDiv.className,
                ].join(''),
            );
        }

        assert.isDefined(findDebugDiv(), 'failed to find the debug div');

        debugDiv.remove();
        assert.isUndefined(findDebugDiv() ?? undefined, 'debug div should have removed itself');
    });
});
