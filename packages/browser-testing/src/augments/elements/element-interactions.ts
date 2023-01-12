import {assert, nextFrame} from '@open-wc/testing';
import {sendKeys, sendMouse} from '@web/test-runner-commands';

function getCenterOfElement(element: Element): [number, number] {
    const rect = element.getBoundingClientRect();
    return [
        Math.floor((rect.left + rect.right) / 2),
        Math.floor((rect.bottom + rect.top) / 2),
    ];
}

async function sendMouseToMiddleOfElement(
    element: Element,
    operationType: 'click' | 'move',
): Promise<void> {
    await sendMouse({
        position: getCenterOfElement(element),
        type: operationType,
    });
}

export async function clickElement(element: Element): Promise<void> {
    await sendMouseToMiddleOfElement(element, 'click');
}

export async function doubleClickElement(element: Element): Promise<void> {
    await sendMouseToMiddleOfElement(element, 'click');
    await sendMouseToMiddleOfElement(element, 'click');
}

export async function typeString(input: string): Promise<void> {
    return await sendKeys({
        type: input,
    });
}

export async function typeStringIntoElement(
    input: string,
    inputElement: HTMLInputElement,
): Promise<void> {
    let attempts = 0;
    const maxAttempts = 20;
    while (!inputElement.matches(':focus') && attempts < maxAttempts) {
        attempts++;
        if (!inputElement.matches(':focus')) {
            await clickElement(inputElement);
        }
        if (!inputElement.matches(':focus')) {
            await nextFrame();
        }
    }
    assert(attempts < maxAttempts, `tried ${maxAttempts} times to select element ${inputElement}`);

    await typeString(input);
}

export async function deleteAllTextInInput(inputElement: HTMLInputElement): Promise<void> {
    const lastValue = inputElement.value;
    if (lastValue) {
        if (!inputElement.matches(':focus')) {
            await clickElement(inputElement);
        }
        await sendKeys({
            press: 'Delete',
        });
        await sendKeys({
            press: 'Backspace',
        });
        if (inputElement.value === lastValue) {
            throw new Error(`Input value was not changed at all`);
        }
        if (inputElement.value.length >= lastValue.length) {
            throw new Error(`Input value was not decreased.`);
        }

        await deleteAllTextInInput(inputElement);
    }
}

export async function moveToElement(element: Element): Promise<void> {
    return sendMouseToMiddleOfElement(element, 'move');
}
