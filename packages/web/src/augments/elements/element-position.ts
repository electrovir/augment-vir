import {assert} from '@augment-vir/assert';
import type {Coords} from '@augment-vir/common';

/**
 * Checks if the current element is completely visible in its scroll view.
 *
 * @category Web : Elements
 * @package @augment-vir/web
 */
export async function checkIfEntirelyInScrollView(element: Element) {
    return checkIfInScrollView(element, 1);
}

/**
 * Check if the given element is visible in its scroll container to the degree of the given ratio.
 *
 * @category Web : Elements
 * @package @augment-vir/web
 */
export async function checkIfInScrollView(
    element: Element,
    /** A number from 0-1, representing 0% to 100%. */
    ratio: number,
) {
    return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries, observerItself) => {
            assert.isLengthAtLeast(entries, 1);
            observerItself.disconnect();
            resolve(entries[0].intersectionRatio >= ratio);
        });
        observer.observe(element);
    });
}

/**
 * Get the center of the current element. This is a relatively expensive operation as it uses
 * [`.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
 * so this should not be called excessively.
 *
 * @category Web : Elements
 * @package @augment-vir/web
 */
export function getCenterOfElement(element: Element): Coords {
    const rect = element.getBoundingClientRect();

    return {
        x: Math.floor((rect.left + rect.right) / 2),
        y: Math.floor((rect.bottom + rect.top) / 2),
    };
}

/**
 * Useful for debugging purposes, this sticks an absolutely positioned and brightly colored div at
 * the given position.
 *
 * @category Web : Elements
 * @package @augment-vir/web
 */
export function appendPositionDebugDiv(position: Coords): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add('debug');
    div.style.backgroundColor = 'blue';
    div.style.height = '10px';
    div.style.left = `${position.x}px`;
    div.style.position = 'absolute';
    div.style.top = `${position.y}px`;
    div.style.width = '10px';
    div.style.zIndex = '9999';
    document.body.append(div);

    return div;
}
