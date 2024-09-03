import {sendKeys} from '@web/test-runner-commands';
import {focusElement} from './element-test-focus.js';

/**
 * Types the given string as if it were input by a keyboard. This doesn't try to type into any
 * element in particular, it'll go wherever the current focus is, if any.
 */
export async function typeString(text: string): Promise<void> {
    return await sendKeys({
        type: text,
    });
}

/** Focus the given element and then type the given string. */
export async function typeStringIntoElement(
    text: string,
    inputElement: Readonly<HTMLInputElement>,
): Promise<void> {
    await focusElement(inputElement);

    await typeString(text);
}

/** Deletes all text that has been typed into the given `<input>` element. */
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
