import {itCases} from '@augment-vir/browser-testing';
import {fixture as renderFixture} from '@open-wc/testing';
import {
    DeclarativeElement,
    DeclarativeElementDefinition,
    HTMLTemplateResult,
    defineElementNoInputs,
    html,
} from 'element-vir';
import {HtmlSpecTagName} from 'html-spec-tags';
import {getDirectChildren, getNestedChildren} from './element-children';

function createChildTester(functionToTest: (element: Readonly<Element>) => Element[]) {
    async function innerTest(templateToTest: HTMLTemplateResult) {
        const fixture = await renderFixture(templateToTest);

        const elements = functionToTest(fixture);

        return elements.map((element) => {
            if (element instanceof DeclarativeElement) {
                return element.constructor;
            } else {
                return element.tagName.toLowerCase();
            }
        }) as (HtmlSpecTagName | DeclarativeElementDefinition)[];
    }

    return innerTest;
}

const TextOnly = defineElementNoInputs({
    tagName: 'text-only',
    renderCallback() {
        return 'hello there';
    },
});
const HasChildren = defineElementNoInputs({
    tagName: 'has-children',
    renderCallback() {
        return html`
            <div>
                <span>hello</span>
                <span>there</span>
            </div>
            <p>more text</p>
        `;
    },
});
const HasSlot = defineElementNoInputs({
    tagName: 'has-slot',
    renderCallback() {
        return html`
            <div>first div</div>
            <slot><p>default slot innards</p></slot>
            <span>also span</span>
        `;
    },
});

describe(getDirectChildren.name, () => {
    itCases(createChildTester(getDirectChildren), [
        {
            it: 'includes direct children of light DOM',
            input: html`
                <section>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </section>
            `,
            expect: [
                'div',
                'div',
                'div',
                'div',
            ],
        },
        {
            it: 'ignores nested children of light DOM',
            input: html`
                <section>
                    <div><span></span></div>
                    <div></div>
                    <p></p>
                    <p></p>
                    <div></div>
                </section>
            `,
            expect: [
                'div',
                'div',
                'p',
                'p',
                'div',
            ],
        },
        {
            it: 'includes no extra children for shadow DOM with no children',
            input: html`
                <section>
                    <${TextOnly}></${TextOnly}>
                    <p></p>
                </section>
            `,
            expect: [
                TextOnly,
                'p',
            ],
        },
        {
            it: 'includes no shadow DOM children when there are none',
            input: html`
                <${TextOnly}></${TextOnly}>
            `,
            expect: [],
        },
        {
            it: 'includes only direct shadow DOM children',
            input: html`
                <${HasChildren}></${HasChildren}>
            `,
            expect: [
                'div',
                'p',
            ],
        },
        {
            it: 'includes slotted elements',
            input: html`
                <${HasSlot}><h1></h1></${HasSlot}>
            `,
            expect: [
                'h1',
                'div',
                'slot',
                'span',
            ],
        },
        {
            it: 'includes slot even if nothing is slotted',
            input: html`
                <${HasSlot}></${HasSlot}>
            `,
            expect: [
                'div',
                'slot',
                'span',
            ],
        },
    ]);
});
describe(getNestedChildren.name, () => {
    itCases(createChildTester(getNestedChildren), [
        {
            it: 'includes all descendants of light DOM',
            input: html`
                <section>
                    <div><span></span></div>
                    <div></div>
                    <p></p>
                    <p></p>
                    <div></div>
                </section>
            `,
            expect: [
                'div',
                'span',
                'div',
                'p',
                'p',
                'div',
            ],
        },
        {
            it: 'includes no extra descendants for shadow DOM with no children',
            input: html`
                <section>
                    <${TextOnly}></${TextOnly}>
                    <p></p>
                </section>
            `,
            expect: [
                TextOnly,
                'p',
            ],
        },
        {
            it: 'includes no shadow DOM descendants when there are none',
            input: html`
                <${TextOnly}></${TextOnly}>
            `,
            expect: [],
        },
        {
            it: 'includes all shadow DOM descendants',
            input: html`
                <${HasChildren}></${HasChildren}>
            `,
            expect: [
                'div',
                'span',
                'span',
                'p',
            ],
        },
        {
            it: 'includes slotted descendants and slot defaults',
            input: html`
                <${HasSlot}><h1></h1></${HasSlot}>
            `,
            expect: [
                'h1',
                'div',
                'slot',
                'p',
                'span',
            ],
        },
        {
            it: 'includes descendants nested in Shadow DOM',
            input: html`
                <section>
                    <${HasSlot}></${HasSlot}>
                </section>
            `,
            expect: [
                HasSlot,
                'div',
                'slot',
                'p',
                'span',
            ],
        },
        {
            it: 'includes all Shadow DOM descendants',
            input: html`
                <section>
                    <${HasSlot}></${HasSlot}>
                    <${HasChildren}></${HasChildren}>
                </section>
            `,
            expect: [
                HasSlot,
                'div',
                'slot',
                'p',
                'span',
                HasChildren,
                'div',
                'span',
                'span',
                'p',
            ],
        },
        {
            it: 'includes slotted Shadow DOM descendants',
            input: html`
                <section>
                    <${HasSlot}>
                        <${HasChildren}></${HasChildren}>
                    </${HasSlot}>
                </section>
            `,
            expect: [
                HasSlot,
                HasChildren,
                'div',
                'span',
                'span',
                'p',
                'div',
                'slot',
                'p',
                'span',
            ],
        },
    ]);
});
