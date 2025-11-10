import {type Locator} from '@playwright/test';

/**
 * Checks if a locator contains the given class.
 *
 * @category Internal
 */
export async function checkHasClass(
    locator: Readonly<Locator>,
    className: string,
): Promise<boolean> {
    if (!className) {
        return false;
    }

    const currentClassValue = (await locator.getAttribute('class')) || '';

    return currentClassValue.includes(className);
}
