import {waitUntil} from '@augment-vir/assert';
import {Dimensions, type PartialWithUndefined} from '@augment-vir/common';
import type {AnyDuration} from '@date-vir/duration';

export async function calculateTextDimensions(
    parentElement: Element,
    text: string,
    customOptions?: PartialWithUndefined<{
        timeout: AnyDuration;
        errorMessage: string;
        /** Set to true to leave the text element in the DOM. */
        debug: boolean;
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

    childAttachPoint.append(textWrapperElement);
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
        await waitUntil.isTruthy(
            () => !!latestSize,
            {
                interval: {milliseconds: 0},
                timeout: customOptions?.timeout || {seconds: 10},
            },
            customOptions?.errorMessage ||
                `Failed to calculate text size in '${parentElement.tagName}'.`,
        );

        /**
         * No way to intentionally trigger this edge case, we're just catching it here for type
         * purposes
         */
        /* node:coverage ignore next 3 */
        if (!latestSize) {
            throw new Error('Failed to calculate text size.');
        }

        return {
            height: latestSize.height,
            width: latestSize.width,
        };
    } finally {
        if (!customOptions?.debug) {
            textWrapperElement.remove();
        }
        resizeObserver.disconnect();
    }
}
