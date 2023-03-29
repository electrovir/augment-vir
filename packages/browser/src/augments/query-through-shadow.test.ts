import {assertTypeOf, itCases} from '@augment-vir/browser-testing';
import {isRuntimeTypeOf} from '@augment-vir/common';
import {assert, fixture as renderFixture} from '@open-wc/testing';
import {defineElementNoInputs, html} from 'element-vir';
import {queryThroughShadow} from './query-through-shadow';

const classNames = {
    nestedDiv: 'nested-div',
    doubleNestedSpan: 'double-nested-span',
    notNestedDiv: 'not-nested-div',
};

const NestedTestElement = defineElementNoInputs({
    tagName: 'nested-test-element',
    renderCallback: () => {
        return html`
            <span class=${classNames.doubleNestedSpan}></span>
        `;
    },
});

const TestElement = defineElementNoInputs({
    tagName: 'test-element',
    renderCallback: () => {
        return html`
            <div class=${classNames.nestedDiv}></div>
            <${NestedTestElement}></${NestedTestElement}>
        `;
    },
});

describe(queryThroughShadow.name, () => {
    it('has correct typings', () => {
        // all = false should not return an array
        assertTypeOf(
            queryThroughShadow({
                element: {} as any,
                query: '',
                all: false,
            }),
        ).toEqualTypeOf<Element | undefined>();
        // all = true should return an array
        assertTypeOf(
            queryThroughShadow({
                element: {} as any,
                query: '',
                all: true,
            }),
        ).toEqualTypeOf<Element[]>();
    });

    itCases(
        async (input: Omit<Parameters<typeof queryThroughShadow>[0], 'element'>) => {
            const rendered = await renderFixture(html`
                <div>
                    <div class=${classNames.notNestedDiv}></div>
                    <${TestElement}></${TestElement}>
                    <${TestElement}></${TestElement}>
                    <div class=${classNames.notNestedDiv}></div>
                </div>
            `);
            const result = queryThroughShadow({
                ...input,
                element: rendered,
            });

            if (input.all) {
                assert.isArray(result);
            }

            if (isRuntimeTypeOf(result, 'array')) {
                return result.length;
            } else {
                return result instanceof Element ? 1 : 0;
            }
        },
        [
            {
                it: 'grabs a non-nested element',
                input: {
                    query: `.${classNames.notNestedDiv}`,
                },
                expect: 1,
            },
            {
                it: 'returns the given element if there is no query',
                input: {
                    query: '',
                },
                expect: 1,
            },
            {
                it: 'grabs multiple non-nested elements',
                input: {
                    query: `.${classNames.notNestedDiv}`,
                    all: true,
                },
                expect: 2,
            },
            {
                it: 'finds nothing for a query with no results',
                input: {
                    query: '.this-does-not-exist',
                },
                expect: 0,
            },
            {
                it: 'grabs the top level of an element with a shadow root',
                input: {
                    query: TestElement.tagName,
                },
                expect: 1,
            },
            {
                it: 'grabs multiple top level elements with a shadow root',
                input: {
                    query: TestElement.tagName,
                    all: true,
                },
                expect: 2,
            },
            {
                it: 'grabs a nested element',
                input: {
                    query: `.${classNames.nestedDiv}`,
                },
                expect: 1,
            },
            {
                it: 'grabs multiple nested elements',
                input: {
                    query: `.${classNames.nestedDiv}`,
                    all: true,
                },
                expect: 2,
            },
            {
                it: 'grabs a double nested element',
                input: {
                    query: `.${classNames.doubleNestedSpan}`,
                },
                expect: 1,
            },
            {
                it: 'grabs multiple double nested elements',
                input: {
                    query: `.${classNames.doubleNestedSpan}`,
                    all: true,
                },
                expect: 2,
            },
            {
                it: 'splits up an all query with child queries',
                input: {
                    query: `${TestElement.tagName} .${classNames.doubleNestedSpan}`,
                    all: true,
                },
                expect: 2,
            },
            {
                it: 'splits up a query with child queries',
                input: {
                    query: `${TestElement.tagName} .${classNames.doubleNestedSpan}`,
                    all: false,
                },
                expect: 1,
            },
            {
                it: 'splits up a query with child queries that has no results',
                input: {
                    query: `.does-not-exist .does-not-exist`,
                    all: false,
                },
                expect: 0,
            },
            {
                it: 'handles a nested query with extra spaces',
                input: {
                    query: `.does-not-exist .does-not-exist`,
                    all: false,
                },
                expect: 0,
            },
        ],
    );
});
