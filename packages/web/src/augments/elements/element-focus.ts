export function isElementFocused(element: Element): boolean {
    return element.matches(':focus');
}
