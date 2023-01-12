/** Query a selector and navigate through shadow trees. Does not traverse nested shadow trees. */
export function querySelector({
    element,
    query,
    all,
}: {
    element: Element | ShadowRoot;
    query: string;
    all: true;
}): Element[];
export function querySelector({
    element,
    query,
    all,
}: {
    element: Element | ShadowRoot;
    query: string;
    all?: false | undefined;
}): Element | undefined;
export function querySelector(inputs: {
    element: Element | ShadowRoot;
    query: string;
    all?: boolean | undefined;
}): Element | Element[] | undefined;
export function querySelector(inputs: {
    element: Element | ShadowRoot;
    query: string;
    all?: boolean | undefined;
}): Element | Element[] | undefined {
    if ('shadowRoot' in inputs.element && inputs.element.shadowRoot) {
        return querySelector({
            ...inputs,
            element: inputs.element.shadowRoot,
        });
    }

    if (inputs.all) {
        return Array.from(inputs.element.querySelectorAll(inputs.query));
    } else {
        return inputs.element.querySelector(inputs.query) ?? undefined;
    }
}
