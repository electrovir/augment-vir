import {isRuntimeEnv, RuntimeEnv, RuntimeEnvError} from '@augment-vir/core';

async function importWebTestApi() {
    if (!isRuntimeEnv(RuntimeEnv.Web)) {
        return new RuntimeEnvError(
            "The 'testWeb' api cannot be used outside of a browser context.",
        );
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
        typeIntoInput: typeStringIntoElement,
        typeText: typeString,
    };
}

/**
 * A suite of web test helpers. This is only accessible within a browser runtime. If accessed
 * outside of a browser runtime, it'll be an Error instead of a collection of test helpers.
 *
 * @category Test
 * @package @augment-vir/test
 */
export const testWeb = (await importWebTestApi()) as Exclude<
    Awaited<ReturnType<typeof importWebTestApi>>,
    Error
>;
