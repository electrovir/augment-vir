import {findMatchingAncestor, getParentElement} from './element-parent.js';

/**
 * Finds the given element's ancestor which allows Y overflow.
 *
 * @category Web : Elements
 * @package @augment-vir/web
 */
export function findOverflowAncestor(start: Element) {
    const parentElement = getParentElement(start);

    return (
        (parentElement &&
            findMatchingAncestor(parentElement, (element) => {
                return globalThis.getComputedStyle(element).overflowY !== 'visible';
            })) ||
        document.body
    );
}
