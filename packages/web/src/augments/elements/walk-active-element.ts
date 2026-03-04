/* node:coverage disable */

/**
 * The callback triggered for each depth traversal in {@link walkActiveElement}. If this returns
 * `true`, the walking stops.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export type WalkActiveElementCallback = (params: {
    element: Element;
    depth: number;
}) => boolean | void | undefined;

/**
 * Get the currently active element and walks the shadow dom to find, if any, the truly active
 * element nested within the shadow dom.
 *
 * @category Web : Elements
 * @category Package : @augment-vir/web
 * @returns The depth that walking stopped at.
 * @package [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web)
 */
export function walkActiveElement(callback: WalkActiveElementCallback): number {
    let depth = 0;

    let activeElement: Element | undefined = document.activeElement || undefined;
    while (activeElement) {
        if (
            callback({
                depth,
                element: activeElement,
            })
        ) {
            return depth;
        }
        activeElement = activeElement.shadowRoot?.activeElement || undefined;
        if (activeElement) {
            ++depth;
        }
    }

    return depth;
}
