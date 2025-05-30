import {describe, itCases, testWeb} from '@augment-vir/test';
import {
    type DeclarativeElementDefinition,
    type HTMLTemplateResult,
    defineElement,
    html,
} from 'element-vir';
import {type SpecTagName} from 'html-spec-tags';
import {
    type ElementTree,
    getDirectChildren,
    getNestedChildren,
    getNestedChildrenTree,
} from './element-children.js';
import {toTagOrDefinition} from './tag-or-definition.js';

function createChildArrayTester(
    functionToTest: (element: Readonly<Element>, depth?: number | undefined) => Element[],
) {
    async function innerTest(templateToTest: HTMLTemplateResult, depth?: number | undefined) {
        const fixture = await testWeb.render(templateToTest);

        const elements = functionToTest(fixture, depth);

        return elements.map(toTagOrDefinition);
    }

    return innerTest;
}

function createChildTreeTester(
    functionToTest: (element: Readonly<Element>, depth?: number | undefined) => ElementTree,
) {
    async function innerTest(
        templateToTest: HTMLTemplateResult,
        depth?: number | undefined,
    ): Promise<ConvertedTree> {
        const fixture = await testWeb.render(templateToTest);

        const tree = functionToTest(fixture, depth);

        return convertTree(tree);
    }

    return innerTest;
}
type ConvertedTree = {
    element: DeclarativeElementDefinition | SpecTagName;
    children: ConvertedTree[];
};

function convertTree(tree: ElementTree): ConvertedTree {
    return {
        element: toTagOrDefinition(tree.element),
        children: tree.children.map(convertTree),
    };
}

const TextOnly = defineElement()({
    tagName: 'text-only',
    render() {
        return 'hello there';
    },
});
const HasChildren = defineElement()({
    tagName: 'has-children',
    render() {
        return html`
            <div>
                <span>hello</span>
                <span>there</span>
            </div>
            <p>more text</p>
        `;
    },
});
const HasSlot = defineElement()({
    tagName: 'has-slot',
    render() {
        return html`
            <div>first div</div>
            <slot><p>default slot innards</p></slot>
            <span>also span</span>
        `;
    },
});

describe(getDirectChildren.name, () => {
    itCases(createChildArrayTester(getDirectChildren), [
        {
            it: 'includes direct children of light DOM',
            inputs: [
                html`
                    <section>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </section>
                `,
            ],
            expect: [
                'div',
                'div',
                'div',
                'div',
            ],
        },
        {
            it: 'ignores nested children of light DOM',
            inputs: [
                html`
                    <section>
                        <div><span></span></div>
                        <div></div>
                        <p></p>
                        <p></p>
                        <div></div>
                    </section>
                `,
            ],
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
            inputs: [
                html`
                    <section>
                        <${TextOnly}></${TextOnly}>
                        <p></p>
                    </section>
                `,
            ],
            expect: [
                TextOnly,
                'p',
            ],
        },
        {
            it: 'includes no shadow DOM children when there are none',
            inputs: [
                html`
                    <${TextOnly}></${TextOnly}>
                `,
            ],
            expect: [],
        },
        {
            it: 'includes only direct shadow DOM children',
            inputs: [
                html`
                    <${HasChildren}></${HasChildren}>
                `,
            ],
            expect: [
                'div',
                'p',
            ],
        },
        {
            it: 'includes slotted elements',
            inputs: [
                html`
                    <${HasSlot}><h1></h1></${HasSlot}>
                `,
            ],
            expect: [
                'h1',
                'div',
                'slot',
                'span',
            ],
        },
        {
            it: 'includes slot even if nothing is slotted',
            inputs: [
                html`
                    <${HasSlot}></${HasSlot}>
                `,
            ],
            expect: [
                'div',
                'slot',
                'span',
            ],
        },
    ]);
});

describe(getNestedChildren.name, () => {
    itCases(createChildArrayTester(getNestedChildren), [
        {
            it: 'includes all descendants of light DOM',
            inputs: [
                html`
                    <section>
                        <div><span></span></div>
                        <div></div>
                        <p></p>
                        <p></p>
                        <div></div>
                    </section>
                `,
            ],
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
            inputs: [
                html`
                    <section>
                        <${TextOnly}></${TextOnly}>
                        <p></p>
                    </section>
                `,
            ],
            expect: [
                TextOnly,
                'p',
            ],
        },
        {
            it: 'includes no shadow DOM descendants when there are none',
            inputs: [
                html`
                    <${TextOnly}></${TextOnly}>
                `,
            ],
            expect: [],
        },
        {
            it: 'includes all shadow DOM descendants',
            inputs: [
                html`
                    <${HasChildren}></${HasChildren}>
                `,
            ],
            expect: [
                'div',
                'span',
                'span',
                'p',
            ],
        },
        {
            it: 'includes slotted descendants and slot defaults',
            inputs: [
                html`
                    <${HasSlot}><h1></h1></${HasSlot}>
                `,
            ],
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
            inputs: [
                html`
                    <section>
                        <${HasSlot}></${HasSlot}>
                    </section>
                `,
            ],
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
            inputs: [
                html`
                    <section>
                        <${HasSlot}></${HasSlot}>
                        <${HasChildren}></${HasChildren}>
                    </section>
                `,
            ],
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
            inputs: [
                html`
                    <section>
                        <${HasSlot}>
                            <${HasChildren}></${HasChildren}>
                        </${HasSlot}>
                    </section>
                `,
            ],
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
        {
            it: 'only goes down 1 level',
            inputs: [
                html`
                    <section>
                        <${HasSlot}>
                            <${HasChildren}></${HasChildren}>
                        </${HasSlot}>
                    </section>
                `,
                1,
            ],
            expect: [HasSlot],
        },
        {
            it: 'only goes down 2 levels',
            inputs: [
                html`
                    <section>
                        <${HasSlot}>
                            <${HasChildren}></${HasChildren}>
                        </${HasSlot}>
                    </section>
                `,
                2,
            ],
            expect: [
                HasSlot,
                HasChildren,
                'div',
                'slot',
                'span',
            ],
        },
        {
            it: 'only goes down 3 levels',
            inputs: [
                html`
                    <section>
                        <${HasSlot}>
                            <${HasChildren}></${HasChildren}>
                        </${HasSlot}>
                    </section>
                `,
                3,
            ],
            expect: [
                HasSlot,
                HasChildren,
                'div',
                'p',
                'div',
                'slot',
                'p',
                'span',
            ],
        },
    ]);
});
describe(getNestedChildrenTree.name, () => {
    itCases(createChildTreeTester(getNestedChildrenTree), [
        {
            it: 'includes all descendants of light DOM',
            inputs: [
                html`
                    <section>
                        <div><span></span></div>
                        <div></div>
                        <p></p>
                        <p></p>
                        <div></div>
                    </section>
                `,
            ],
            expect: {
                element: 'section',
                children: [
                    {
                        element: 'div',
                        children: [
                            {
                                element: 'span',
                                children: [],
                            },
                        ],
                    },
                    {
                        element: 'div',
                        children: [],
                    },
                    {
                        element: 'p',
                        children: [],
                    },
                    {
                        element: 'p',
                        children: [],
                    },
                    {
                        element: 'div',
                        children: [],
                    },
                ],
            },
        },
        {
            it: 'includes no extra descendants for shadow DOM with no children',
            inputs: [
                html`
                    <section>
                        <${TextOnly}></${TextOnly}>
                        <p></p>
                    </section>
                `,
            ],
            expect: {
                element: 'section',
                children: [
                    {
                        element: TextOnly,
                        children: [],
                    },
                    {
                        element: 'p',
                        children: [],
                    },
                ],
            },
        },
        {
            it: 'includes no shadow DOM descendants when there are none',
            inputs: [
                html`
                    <${TextOnly}></${TextOnly}>
                `,
            ],
            expect: {
                element: TextOnly,
                children: [],
            },
        },
        {
            it: 'includes all shadow DOM descendants',
            inputs: [
                html`
                    <${HasChildren}></${HasChildren}>
                `,
            ],
            expect: {
                element: HasChildren,
                children: [
                    {
                        element: 'div',
                        children: [
                            {
                                element: 'span',
                                children: [],
                            },
                            {
                                element: 'span',
                                children: [],
                            },
                        ],
                    },
                    {
                        element: 'p',
                        children: [],
                    },
                ],
            },
        },
        {
            it: 'includes slotted descendants and slot defaults',
            inputs: [
                html`
                    <${HasSlot}><h1></h1></${HasSlot}>
                `,
            ],
            expect: {
                element: HasSlot,
                children: [
                    {
                        element: 'h1',
                        children: [],
                    },
                    {
                        element: 'div',
                        children: [],
                    },
                    {
                        element: 'slot',
                        children: [
                            {
                                element: 'p',
                                children: [],
                            },
                        ],
                    },
                    {
                        element: 'span',
                        children: [],
                    },
                ],
            },
        },
        {
            it: 'includes descendants nested in Shadow DOM',
            inputs: [
                html`
                    <section>
                        <${HasSlot}></${HasSlot}>
                    </section>
                `,
            ],
            expect: {
                element: 'section',
                children: [
                    {
                        element: HasSlot,
                        children: [
                            {
                                element: 'div',
                                children: [],
                            },
                            {
                                element: 'slot',
                                children: [
                                    {
                                        element: 'p',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                element: 'span',
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
        {
            it: 'includes all Shadow DOM descendants',
            inputs: [
                html`
                    <section>
                        <${HasSlot}></${HasSlot}>
                        <${HasChildren}></${HasChildren}>
                    </section>
                `,
            ],
            expect: {
                element: 'section',
                children: [
                    {
                        element: HasSlot,
                        children: [
                            {
                                element: 'div',
                                children: [],
                            },
                            {
                                element: 'slot',
                                children: [
                                    {
                                        element: 'p',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                element: 'span',
                                children: [],
                            },
                        ],
                    },
                    {
                        element: HasChildren,
                        children: [
                            {
                                element: 'div',
                                children: [
                                    {
                                        element: 'span',
                                        children: [],
                                    },
                                    {
                                        element: 'span',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                element: 'p',
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
        {
            it: 'includes slotted Shadow DOM descendants',
            inputs: [
                html`
                    <section>
                        <${HasSlot}>
                            <${HasChildren}></${HasChildren}>
                        </${HasSlot}>
                    </section>
                `,
            ],
            expect: {
                element: 'section',
                children: [
                    {
                        element: HasSlot,
                        children: [
                            {
                                element: HasChildren,
                                children: [
                                    {
                                        element: 'div',
                                        children: [
                                            {
                                                element: 'span',
                                                children: [],
                                            },
                                            {
                                                element: 'span',
                                                children: [],
                                            },
                                        ],
                                    },
                                    {
                                        element: 'p',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                element: 'div',
                                children: [],
                            },
                            {
                                element: 'slot',
                                children: [
                                    {
                                        element: 'p',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                element: 'span',
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
        {
            it: 'only goes down 1 level',
            inputs: [
                html`
                    <section>
                        <${HasSlot}>
                            <${HasChildren}></${HasChildren}>
                        </${HasSlot}>
                    </section>
                `,
                1,
            ],
            expect: {
                element: 'section',
                children: [
                    {
                        element: HasSlot,
                        children: [],
                    },
                ],
            },
        },
        {
            it: 'only goes down 2 levels',
            inputs: [
                html`
                    <section>
                        <${HasSlot}>
                            <${HasChildren}></${HasChildren}>
                        </${HasSlot}>
                    </section>
                `,
                2,
            ],
            expect: {
                element: 'section',
                children: [
                    {
                        element: HasSlot,
                        children: [
                            {
                                element: HasChildren,
                                children: [],
                            },
                            {
                                element: 'div',
                                children: [],
                            },
                            {
                                element: 'slot',
                                children: [],
                            },
                            {
                                element: 'span',
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
        {
            it: 'only goes down 3 levels',
            inputs: [
                html`
                    <section>
                        <${HasSlot}>
                            <${HasChildren}></${HasChildren}>
                        </${HasSlot}>
                    </section>
                `,
                3,
            ],
            expect: {
                element: 'section',
                children: [
                    {
                        element: HasSlot,
                        children: [
                            {
                                element: HasChildren,
                                children: [
                                    {
                                        element: 'div',
                                        children: [],
                                    },
                                    {
                                        element: 'p',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                element: 'div',
                                children: [],
                            },
                            {
                                element: 'slot',
                                children: [
                                    {
                                        element: 'p',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                element: 'span',
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
    ]);
});
