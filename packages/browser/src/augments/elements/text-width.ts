import {Dimensions, PartialAndUndefined, waitForCondition} from '@augment-vir/common';

export async function calculateTextDimensions(
    parentElement: Element,
    text: string,
    customOptions?: PartialAndUndefined<{
        timeout: {milliseconds: number};
        errorMessage: string;
    }>,
): Promise<Dimensions> {
    if (!text) {
        return {
            width: 0,
            height: 0,
        };
    }
    const textWrapperElement = document.createElement('span');
    textWrapperElement.style.visibility = 'hidden';
    textWrapperElement.style.position = 'absolute';
    textWrapperElement.style.zIndex = '-9999';
    textWrapperElement.style.opacity = '0';
    textWrapperElement.style.pointerEvents = 'none';
    textWrapperElement.style.userSelect = 'none';
    textWrapperElement.style.webkitUserSelect = 'none';
    textWrapperElement.style.animation = 'none';
    textWrapperElement.style.transition = 'none';
    textWrapperElement.setAttribute('aria-hidden', 'true');

    /** Automatically account for shadow roots. */
    const childAttachPoint = parentElement.shadowRoot || parentElement;

    childAttachPoint.appendChild(textWrapperElement);
    let latestSize: DOMRectReadOnly | undefined;
    /**
     * Use resize observer instead of clientWidth, getComputedStyle, or getBoundingClientRect to
     * prevent a forced re-layout. See https://gist.github.com/paulirish/5d52fb081b3570c81e3a.
     */
    const resizeObserver = new ResizeObserver((entries) => {
        latestSize = entries[0]?.contentRect;
    });
    resizeObserver.observe(textWrapperElement);
    textWrapperElement.innerText = text;

    try {
        await waitForCondition({
            conditionCallback() {
                return !!latestSize;
            },
            intervalMs: 100,
            timeoutMs: customOptions?.timeout?.milliseconds || 10_000,
            timeoutMessage:
                customOptions?.errorMessage ||
                `Failed to calculate text size in '${parentElement.tagName}'.`,
        });

        /**
         * No way to intentionally trigger this edge case, we're just catching it here for type
         * purposes
         */
        /* c8 ignore start */
        if (!latestSize) {
            throw new Error('Failed to calculate text size.');
        }
        /* c8 ignore stop */

        return {
            height: latestSize.height,
            width: latestSize.width,
        };
    } finally {
        textWrapperElement.remove();
        resizeObserver.disconnect();
    }
}
