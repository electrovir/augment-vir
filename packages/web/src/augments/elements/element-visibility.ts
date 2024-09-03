/**
 * Detects `display: none` and only works if the element does not have `position: fixed;`.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export function isElementVisible(element: HTMLElement): boolean {
    // https://stackoverflow.com/a/21696585
    return element.offsetParent !== null;
}
