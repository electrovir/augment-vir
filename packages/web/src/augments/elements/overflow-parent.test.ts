import {assert} from '@augment-vir/assert';
import {describe, itCases, testWeb} from '@augment-vir/test';
import {CSSResult, HTMLTemplateResult, css, html} from 'element-vir';
import {findOverflowParent} from './overflow-parent.js';

describe(findOverflowParent.name, () => {
    async function testFindOverflowParent(
        wrapperStyle?: CSSResult | undefined,
        extraTemplate?: HTMLTemplateResult | undefined,
    ) {
        const wrapper = await testWeb.render(html`
            <div style=${wrapperStyle}>
                <div>
                    <div
                        class="target"
                        style=${css`
                            width: 100px;
                            height: 100px;
                        `}
                    ></div>
                </div>
                ${extraTemplate}
            </div>
        `);

        const targetElement = wrapper.querySelector('.target');

        assert.instanceOf(targetElement, HTMLDivElement);
        assert.instanceOf(wrapper, HTMLDivElement);

        const overflowParent = findOverflowParent(targetElement);

        return {
            isBody: overflowParent === document.body,
            isWrapper: overflowParent === wrapper,
        };
    }

    itCases(testFindOverflowParent, [
        {
            it: 'grabs the body if there is no overflow',
            inputs: [],
            expect: {
                isBody: true,
                isWrapper: false,
            },
        },
        {
            it: 'grabs the wrapper if it has limited overflow',
            inputs: [
                css`
                    overflow: hidden;
                `,
            ],
            expect: {
                isBody: false,
                isWrapper: true,
            },
        },
        {
            it: 'grabs the wrapper if it is scrolling',
            inputs: [
                css`
                    overflow: auto;
                `,
                html`
                    <div
                        style=${css`
                            height: 2000px;
                        `}
                    >
                        LOTS OF SPACE HERE
                    </div>
                `,
            ],
            expect: {
                isBody: false,
                isWrapper: true,
            },
        },
    ]);
});
