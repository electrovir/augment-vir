import {itCases} from '@augment-vir/browser-testing';
import {fixture} from '@open-wc/testing';
import {CSSResult, HTMLTemplateResult, css, html} from 'element-vir';
import {assertInstanceOf} from 'run-time-assertions';
import {findOverflowParent} from './overflow-parent';

describe(findOverflowParent.name, () => {
    async function testFindOverflowParent(
        wrapperStyle?: CSSResult | undefined,
        extraTemplate?: HTMLTemplateResult | undefined,
    ) {
        const wrapper = await fixture(html`
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

        assertInstanceOf(targetElement, HTMLDivElement);
        assertInstanceOf(wrapper, HTMLDivElement);

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
