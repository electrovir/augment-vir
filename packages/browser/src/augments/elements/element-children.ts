/**
 * Get all deeply nested elements contained within the given element. Shadow DOMs are included in
 * the nesting.
 *
 * Note that `<slot>` elements are included, as well as their nested elements (even if a slot filler
 * is provided by the parent) and the slot filler itself (if provided).
 */
export function getNestedChildren(startingElement: Readonly<Element>): Element[] {
    const children = getDirectChildren(startingElement);

    const nestedChildren = children
        .map((child) =>
            [
                child,
                getNestedChildren(child),
            ].flat(),
        )
        .flat();

    return nestedChildren;
}

/**
 * Get's an element's direct children. Includes slotted elements, direct `<slot>` children
 * themselves, and all direct children of a shadow DOM. Default `<slot>` children are not included
 * (since they're not "direct" as they are nested under `<slot>`).
 *
 * Note that that slotted elements and light dom elements will always be shown above shadow dom
 * elements. Besides that, the order of children is preserved.
 */
export function getDirectChildren(startingElement: Readonly<Element>): Element[] {
    const children = [
        ...startingElement.children,
        ...(startingElement.shadowRoot?.children ?? []),
    ];

    return children;
}
