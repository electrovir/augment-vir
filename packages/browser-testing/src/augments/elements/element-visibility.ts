import {assert} from '@open-wc/testing';

function isElementShown(element: HTMLElement): boolean {
    // https://stackoverflow.com/a/21696585
    return element.offsetParent !== null;
}

export function assertVisible(element: HTMLElement, visible: boolean, message = '') {
    const extraMessage = message ? `: ${message}` : '';
    const isVisible = isElementShown(element);
    if (visible) {
        assert.isTrue(isVisible, `element ${element.tagName} was not visible${extraMessage}`);
    } else {
        assert.isFalse(isVisible, `element ${element.tagName} was not hidden${extraMessage}`);
    }
}
