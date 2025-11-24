import {getCenterOfElement} from './symlinked/element-position.js';

async function sendMouseToMiddleOfElement(
    element: Element,
    operationType: 'click' | 'move',
): Promise<void> {
    const {sendMouse} = await import('@web/test-runner-commands');

    const center = getCenterOfElement(element);

    await sendMouse({
        position: [
            center.x,
            center.y,
        ],
        type: operationType,
    });
}

export async function clickElement(element: Element): Promise<void> {
    await sendMouseToMiddleOfElement(element, 'click');
}

export async function moveToElement(element: Element): Promise<void> {
    return sendMouseToMiddleOfElement(element, 'move');
}
