/**
 * Detects whether the given element is currently focused.
 *
 * @category Web : Elements
 * @package @augment-vir/web
 */
export function isElementFocused(element: Element): boolean {
    return element.matches(':focus');
}
