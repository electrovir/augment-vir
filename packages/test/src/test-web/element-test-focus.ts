import {assert} from '@augment-vir/assert';
import {clickElement} from './click-element.js';
import {waitForAnimationFrame} from './symlinked/animation-frame.js';
import {isElementFocused} from './symlinked/element-focus.js';

/** Repeatedly tries to focus the given element until it is focused. */
export async function focusElement(element: Element, maxAttemptCount: number = 20) {
    let attempts = 0;
    while (!isElementFocused(element) && attempts < maxAttemptCount) {
        ++attempts;
        if (!isElementFocused(element)) {
            await clickElement(element);
        }
        if (!isElementFocused(element)) {
            await waitForAnimationFrame();
        }
    }
    assert.isBelow(
        attempts,
        maxAttemptCount,
        `Tried ${maxAttemptCount} times to focus the given input element.`,
    );
}
