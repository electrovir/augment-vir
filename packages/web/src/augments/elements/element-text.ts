export function extractElementText(element: Element | ShadowRoot): string {
    const value = (element as HTMLInputElement).value;
    const shadowRoot = (element as Element).shadowRoot;
    const textContent = element.textContent?.trim();

    if (textContent) {
        return textContent;
    } else if (shadowRoot) {
        return extractElementText(shadowRoot);
    } else if (value) {
        return value;
    } else {
        return '';
    }
}
