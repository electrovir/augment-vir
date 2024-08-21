import {findMatchingAncestor, getParentElement} from './element-parent.js';

export function findOverflowParent(start: Element) {
    const parentElement = getParentElement(start);

    return (
        (parentElement &&
            findMatchingAncestor(parentElement, (element) => {
                return globalThis.getComputedStyle(element).overflowY !== 'visible';
            })) ||
        document.body
    );
}
