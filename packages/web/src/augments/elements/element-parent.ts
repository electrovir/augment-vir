/**
 * Gets the parent element of the current element, even if the current element is a `ShadowRoot`.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export function getParentElement(element: Node): Element | undefined {
    if (element instanceof ShadowRoot) {
        return getParentElement(element.host);
    }

    const parentNode = element.parentNode;

    if (!parentNode) {
        return undefined;
    } else if (parentNode instanceof Element) {
        return parentNode;
    } else {
        return getParentElement(parentNode);
    }
}

/**
 * Recursively search for an ancestor of the starting element that passes the given callback.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export function findMatchingAncestor(
    start: Element,
    testParent: (parent: Element) => boolean,
): Element | undefined {
    if (testParent(start)) {
        return start;
    }

    const parent = getParentElement(start);

    if (!parent) {
        return undefined;
    }

    return findMatchingAncestor(parent, testParent);
}
