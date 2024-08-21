import {getCenterOfElement} from '@augment-vir/web';
import {sendMouse} from '@web/test-runner-commands';

async function sendMouseToMiddleOfElement(
    element: Element,
    operationType: 'click' | 'move',
): Promise<void> {
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
