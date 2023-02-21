import {isRuntimeTypeOf, isTruthy} from '@augment-vir/common';

export type QueryThroughShadowInputs = {
    element: Element | ShadowRoot;
    query: string;
    all?: boolean | undefined;
};

export function queryThroughShadow(inputs: {
    element: Element | ShadowRoot;
    query: string;
    all: true;
}): Element[];
export function queryThroughShadow(inputs: {
    element: Element | ShadowRoot;
    query: string;
    all?: false | undefined;
}): Element | undefined;
export function queryThroughShadow(inputs: {
    element: Element | ShadowRoot;
    query: string;
    all?: boolean | undefined;
}): Element | Element[] | undefined;
export function queryThroughShadow(
    inputs: QueryThroughShadowInputs,
): Element | Element[] | undefined {
    const splitQuery = inputs.query.split(' ').filter(isTruthy);
    if (!inputs.query) {
        if (inputs.element instanceof Element) {
            return inputs.element;
        } else {
            return inputs.element.host;
        }
    }

    if (splitQuery.length > 1) {
        return handleNestedQueries({...inputs, queries: splitQuery});
    }

    if ('shadowRoot' in inputs.element && inputs.element.shadowRoot) {
        return queryThroughShadow({
            ...inputs,
            element: inputs.element.shadowRoot,
        });
    }

    const shadowRootChildren = Array.from(inputs.element.children)
        .filter(
            (child): child is Element & {shadowRoot: NonNullable<Element['shadowRoot']>} =>
                !!child.shadowRoot,
        )
        .map((child) => child.shadowRoot);

    if (inputs.all) {
        const outerResults = Array.from(inputs.element.querySelectorAll(inputs.query));
        const nestedResults = shadowRootChildren
            .map((shadowRootChild) => {
                return queryThroughShadow({
                    ...inputs,
                    all: true,
                    element: shadowRootChild,
                });
            })
            .flat();
        return [
            ...outerResults,
            ...nestedResults,
        ];
    } else {
        const basicResult = inputs.element.querySelector(inputs.query);

        if (basicResult) {
            return basicResult;
        } else {
            for (
                let shadowRootChildIndex = 0;
                shadowRootChildIndex < shadowRootChildren.length;
                shadowRootChildIndex++
            ) {
                const shadowRootChild = shadowRootChildren[shadowRootChildIndex]!;
                const nestedResult = queryThroughShadow({
                    ...inputs,
                    element: shadowRootChild,
                });
                if (nestedResult) {
                    return nestedResult;
                }
            }

            return undefined;
        }
    }
}

function handleNestedQueries(
    inputs: QueryThroughShadowInputs & {queries: string[]},
): Element | Element[] | undefined {
    const firstQuery = inputs.queries[0];

    /** No way to intentionally trigger this edge case, we're just catching it here for type purposes */
    /* c8 ignore next 7 */
    if (!firstQuery) {
        throw new Error(
            `Somehow the first query was empty in '[${inputs.queries.join(',')}]' for query '${
                inputs.query
            }'`,
        );
    }
    const results = queryThroughShadow({
        ...inputs,
        query: firstQuery,
    });

    if (inputs.queries.length <= 1) {
        return results;
    }

    if (isRuntimeTypeOf(results, 'array')) {
        return results
            .map((result) => {
                return handleNestedQueries({
                    ...inputs,
                    element: result,
                    queries: inputs.queries.slice(1),
                });
            })
            .flat()
            .filter(isTruthy);
    } else {
        if (results) {
            return handleNestedQueries({
                ...inputs,
                element: results,
                queries: inputs.queries.slice(1),
            });
        } else {
            return undefined;
        }
    }
}
