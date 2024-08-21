import {assert} from '@augment-vir/assert';
import {isElementFocused} from '@augment-vir/web';
import {nextFrame} from '@open-wc/testing';
import {clickElement} from './click-element.js';

export async function focusElement(element: Element, maxAttemptCount: number = 20) {
    let attempts = 0;
    while (!isElementFocused(element) && attempts < maxAttemptCount) {
        ++attempts;
        if (!isElementFocused(element)) {
            await clickElement(element);
        }
        if (!isElementFocused(element)) {
            await nextFrame();
        }
    }
    assert.isBelow(
        attempts,
        maxAttemptCount,
        `Tried ${maxAttemptCount} times to focus the given input element.`,
    );
}
