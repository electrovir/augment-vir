/**
 * Extracts the text content of the given element.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export function extractElementText(element: Readonly<Element>): string {
    return recursivelyExtractElementText(element).join('\n');
}

function recursivelyExtractElementText(node: Readonly<Node>): string[] {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        return text ? [text] : [];
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;

        if (element.tagName.toLowerCase() === 'slot') {
            const slotElement = element as HTMLSlotElement;
            const assignedNodes = slotElement.assignedNodes();

            return (assignedNodes.length ? assignedNodes : Array.from(element.childNodes)).flatMap(
                (assignedNode) => recursivelyExtractElementText(assignedNode),
            );
        } else {
            return Array.from((element.shadowRoot || element).childNodes).flatMap((childNode) =>
                recursivelyExtractElementText(childNode),
            );
        }
    }

    return [];
}
