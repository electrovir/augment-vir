import {focusElement} from './element-test-focus.js';

export async function typeString(text: string): Promise<void> {
    const {sendKeys} = await import('@web/test-runner-commands');
    return await sendKeys({
        type: text,
    });
}

export async function typeStringIntoElement(
    text: string,
    element: Readonly<HTMLElement>,
): Promise<void> {
    await focusElement(element);

    await typeString(text);
}

export async function deleteAllTextInInput(
    inputElement: Readonly<HTMLInputElement>,
): Promise<void> {
    const {sendKeys} = await import('@web/test-runner-commands');
    const lastValue = inputElement.value;
    if (lastValue) {
        await focusElement(inputElement);
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
            throw new Error(`Input value length was not decreased.`);
        }

        await deleteAllTextInInput(inputElement);
    }
}
