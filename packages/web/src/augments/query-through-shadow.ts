import {check} from '@augment-vir/assert';
import type {PartialWithUndefined} from '@augment-vir/common';
import {stringify} from '@augment-vir/core';

export type QueryThroughShadowOptions = PartialWithUndefined<{
    all: boolean;
}>;

export function queryThroughShadow(
    element: Element | ShadowRoot,
    query: string | {tagName: string},
    options: {
        all: true;
    },
): Element[];
export function queryThroughShadow(
    element: Element | ShadowRoot,
    query: string | {tagName: string},
    options: {
        all?: false | undefined;
    },
): Element | undefined;
export function queryThroughShadow(
    element: Element | ShadowRoot,
    query: string | {tagName: string},
    options: QueryThroughShadowOptions,
): Element | Element[] | undefined;
export function queryThroughShadow(
    element: Element | ShadowRoot,
    rawQuery: string | {tagName: string},
    options: QueryThroughShadowOptions,
): Element | Element[] | undefined {
    if (!rawQuery) {
        if (element instanceof Element) {
            return element;
        } else {
            return element.host;
        }
    }
    const query: string = check.isString(rawQuery) ? rawQuery : rawQuery.tagName;

    const splitQuery: string[] = query.split(' ').filter(check.isTruthy);

    if (splitQuery.length > 1) {
        return handleNestedQueries(element, query, options, splitQuery);
    } else if ('shadowRoot' in element && element.shadowRoot) {
        return queryThroughShadow(element.shadowRoot, query, options);
    }

    const shadowRootChildren = Array.from(element.querySelectorAll('*'))
        .filter(
            (child): child is Element & {shadowRoot: NonNullable<Element['shadowRoot']>} =>
                !!child.shadowRoot,
        )
        .map((child) => child.shadowRoot);

    if (options.all) {
        const outerResults = Array.from(element.querySelectorAll(query));
        const nestedResults = shadowRootChildren.flatMap((shadowRootChild) => {
            return queryThroughShadow(shadowRootChild, query, options) as Element[];
        });
        return [
            ...outerResults,
            ...nestedResults,
        ];
    } else {
        const basicResult = element.querySelector(query);

        if (basicResult) {
            return basicResult;
        } else {
            for (const shadowRootChild of shadowRootChildren) {
                const nestedResult = queryThroughShadow(shadowRootChild, query, options);
                if (nestedResult) {
                    return nestedResult;
                }
            }

            return undefined;
        }
    }
}

function handleNestedQueries(
    element: Element | ShadowRoot,
    originalQuery: string | {tagName: string},
    options: QueryThroughShadowOptions,
    queries: string[],
): Element | Element[] | undefined {
    const firstQuery = queries[0];

    /**
     * No way to intentionally trigger this edge case, we're just catching it here for type
     * purposes.
     */
    /* node:coverage ignore next 7 */
    if (!firstQuery) {
        throw new Error(
            `Somehow the first query was empty in '[${queries.join(',')}]' for query '${stringify(originalQuery)}'`,
        );
    }
    const results = queryThroughShadow(element, firstQuery, options);

    if (queries.length <= 1) {
        return results;
    }

    if (check.isArray(results)) {
        return results
            .flatMap((result) => {
                return handleNestedQueries(result, originalQuery, options, queries.slice(1));
            })
            .filter(check.isTruthy);
    } else if (results) {
        return handleNestedQueries(results, originalQuery, options, queries.slice(1));
    } else {
        return undefined;
    }
}
