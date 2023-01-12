export function extractText(element: Element | ShadowRoot): string {
    const value = (element as HTMLInputElement).value;
    const shadowRoot = (element as Element).shadowRoot;
    const textContent = element.textContent?.trim();

    if (textContent) {
        return textContent;
    } else if (shadowRoot) {
        return extractText(shadowRoot);
    } else if (value) {
        return value;
    } else {
        return '';
    }
}
