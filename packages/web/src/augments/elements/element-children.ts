/**
 * Gets all deeply nested elements contained within the given element. Shadow DOMs are traversed.
 *
 * Note that `<slot>` elements are included, as well as their nested elements (even if a slot filler
 * is provided by the parent) and the slot filler itself (if provided).
 *
 * Optionally define a second "depth" input to control how far nestings should be pursued. Leave
 * depth out or set it to undefined or any value <= 0 to allow full depth search.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @package @augment-vir/web
 */
export function getNestedChildren(
    startingElement: Readonly<Element>,
    depth?: number | undefined,
): Element[] {
    return recursivelyGetNestedChildren(startingElement, depth ?? 0, 0);
}
function recursivelyGetNestedChildren(
    startingElement: Readonly<Element>,
    maxDepth: number,
    currentDepth: number,
): Element[] {
    const children = getDirectChildren(startingElement);

    return children.flatMap((child) => {
        const nextDepth = currentDepth + 1;
        const nested =
            maxDepth && nextDepth >= maxDepth
                ? []
                : recursivelyGetNestedChildren(child, maxDepth, nextDepth);
        return [
            child,
            nested,
        ].flat();
    });
}

/**
 * Gets an element's direct children. Includes slotted elements, direct `<slot>` children
 * themselves, and all direct children of a shadow DOM. Default `<slot>` children are not included
 * (since they're not "direct" children as they are nested under `<slot>`).
 *
 * Note that that slotted elements and light dom elements will always be shown above shadow dom
 * elements. Besides that, the order of children is preserved.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @package @augment-vir/web
 */
export function getDirectChildren(startingElement: Readonly<Element>): Element[] {
    return [
        ...startingElement.children,
        ...(startingElement.shadowRoot?.children ?? []),
    ];
}
