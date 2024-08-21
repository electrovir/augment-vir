/** Detects `display: none` and only works if the element does not have `position: fixed;`. */
export function isElementVisible(element: HTMLElement): boolean {
    // https://stackoverflow.com/a/21696585
    return element.offsetParent !== null;
}
