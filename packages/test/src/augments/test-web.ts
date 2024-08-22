import {isRuntimeEnv, RuntimeEnv, RuntimeEnvError} from '@augment-vir/core';

async function importWebTestApi() {
    if (!isRuntimeEnv(RuntimeEnv.Web)) {
        return new RuntimeEnvError('The testWeb api cannot be used outside of a browser context.');
    }
    const {clickElement, moveToElement} = await import('../test-web/click-element');
    const {focusElement} = await import('../test-web/element-test-focus');
    const {cleanupFixture, renderFixture} = await import('../test-web/open-wc-exports');
    const {deleteAllTextInInput, typeString, typeStringIntoElement} = await import(
        '../test-web/type-into-element'
    );

    return {
        cleanupRender: cleanupFixture,
        click: clickElement,
        deleteInputText: deleteAllTextInInput,
        ensureFocus: focusElement,
        moveMouseTo: moveToElement,
        render: renderFixture,
        type: typeString,
        typeIntoInput: typeStringIntoElement,
    };
}

export const testWeb = (await importWebTestApi()) as Exclude<
    Awaited<ReturnType<typeof importWebTestApi>>,
    Error
>;
