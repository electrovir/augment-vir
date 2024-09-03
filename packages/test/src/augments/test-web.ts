import {isRuntimeEnv, RuntimeEnv, RuntimeEnvError} from '@augment-vir/core';

async function importWebTestApi() {
    if (!isRuntimeEnv(RuntimeEnv.Web)) {
        return new RuntimeEnvError(
            "The 'testWeb' api cannot be used outside of a browser context.",
        );
    }
    const {clickElement, moveToElement} = await import('../test-web/click-element');
    const {focusElement} = await import('../test-web/element-test-focus');
    const {deleteAllTextInInput, typeString, typeStringIntoElement} = await import(
        '../test-web/type-into-element'
    );
    const {fixtureCleanup, fixture} = await import('@open-wc/testing-helpers');

    return {
        /**
         * Cleans up all rendered test HTML by removing the actual wrapper nodes. Common use case is
         * at the end of each test.
         */
        cleanupRender: fixtureCleanup,
        /** Clicks the center of the given element. */
        click: clickElement,
        /** Deletes all text that has been typed into the given `<input>` element. */
        deleteInputText: deleteAllTextInInput,
        /** Repeatedly tries to focus the given element until it is focused. */
        ensureFocus: focusElement,
        /** Moves the mouse to the center of the given element. */
        moveMouseTo: moveToElement,
        /**
         * Renders a string or TemplateResult and puts it in the DOM via a fixtureWrapper.
         *
         * Uses `fixture` from `@open-wc/testing-helpers`.
         *
         * @example
         *
         * ```ts
         * import {testWeb} from '@augment-vir/test';
         * import {html} from 'element-vir';
         *
         * const rendered = await testWeb.render(html`
         *     <${MyElement}><span></span></${MyElement}>
         * `);
         * ```
         *
         * @returns A Promise that will resolve to the first child of the rendered HTML.
         */
        render: fixture,
        /** Focus the given element and then type the given string. */
        typeIntoInput: typeStringIntoElement,
        /**
         * Types the given string as if it were input by a keyboard. This doesn't try to type into
         * any element in particular, it'll go wherever the current focus is, if any.
         */
        typeText: typeString,
    };
}

/**
 * A suite of web test helpers. This is only accessible within a browser runtime. If accessed
 * outside of a browser runtime, it'll be an Error instead of a collection of test helpers.
 *
 * @category Test
 * @category Package : @augment-vir/test
 * @package [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test)
 */
export const testWeb = (await importWebTestApi()) as Exclude<
    Awaited<ReturnType<typeof importWebTestApi>>,
    Error
>;
