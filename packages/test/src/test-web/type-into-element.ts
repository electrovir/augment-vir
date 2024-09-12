import {sendKeys} from '@web/test-runner-commands';
import {focusElement} from './element-test-focus.js';

export async function typeString(text: string): Promise<void> {
    return await sendKeys({
        type: text,
    });
}

export async function typeStringIntoElement(
    text: string,
    inputElement: Readonly<HTMLInputElement>,
): Promise<void> {
    await focusElement(inputElement);

    await typeString(text);
}

export async function deleteAllTextInInput(
    inputElement: Readonly<HTMLInputElement>,
): Promise<void> {
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
