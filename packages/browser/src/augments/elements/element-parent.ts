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

export function findMatchingParent(
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

    return findMatchingParent(parent, testParent);
}
