/**
 * Detects `display: none` and only works if the element does not have `position: fixed;`.
 *
 * @category Web : Elements
 * @package @augment-vir/web
 */
export function isElementVisible(element: HTMLElement): boolean {
    // https://stackoverflow.com/a/21696585
    return element.offsetParent !== null;
}
