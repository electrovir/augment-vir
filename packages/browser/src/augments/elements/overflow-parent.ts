import {findMatchingParent, getParentElement} from './element-parent';

export function findOverflowParent(start: Element) {
    const parentElement = getParentElement(start);

    return (
        (parentElement &&
            findMatchingParent(parentElement, (element) => {
                return globalThis.getComputedStyle(element).overflowY !== 'visible';
            })) ||
        document.body
    );
}
