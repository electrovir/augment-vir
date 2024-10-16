# Todo

-   add a pretty diff to the assertion errors like chai has
    -   or at least include functions in the stringify output
-   make a snapshot function in `@augment-vir/test` that supports both Node.js's built-in test runner's snapshot testing as well as something that works in web-test-runner.
    -   add `itSnapshots`
-   look into using typedoc plugins
    -   https://github.com/Gerrit0/typedoc-plugin-mdn-links
    -   https://github.com/eyworldwide/typedoc-plugin-remove-references
    -   https://github.com/Gerrit0/typedoc-plugin-missing-exports
-   make `isElementVisible` work in more situations (see its stackoverflow link)
-   reverse engineer how web-test-runner calculates code coverage, because it works really well, and apply it to node test coverage
-   add type guards to the boundary assertions on strings (like `assert.endsWith`)
-   add a logger that saves to a file or to indexeddb
-   create an augment that is like `Promise.all` but works on objects
-   add shallow copy and deep copy
-   move virmator's dir-contents augments into `@augment-vir/node`
-   move path transforms to `@augment-vir/common` (like `toPosixPath`)
    -   maybe
-   add a `convert` which is like `assert`
    -   `convertTo.number`, `convertToEnsured.number`, `convertToMaybe.number`, etc. for numbers, strings, etc.
    -   remove `number-conversation.ts`
-   just a plain `diff` function
    -   better outputs from `diffArray` (it should output a partial)
-   add a function that batches `Promise.all` calls
-   allow readonly inputs to all guards (like assert.deepEquals)

## Immediately after v30 release

-   use `ListenTarget` for `ShellEmitter`
-   convert `Debounce` into an ListenTarget and emit events when:
    -   execute is called with no callback
    -   the callback is triggered
    -   the callback is skipped
-   update all deps from `virmator` so they're all on v30 of augment-vir
    -   `element-vir`
    -   `mono-vir`
    -   `markdown-code-example-inserter`
    -   `prettier-plugin-interpolated-html-tags`
    -   `proxy-vir`
    -   `prettier-plugin-multiline-arrays`
    -   `augment-vir`
    -   `mock-vir`
    -   `virmator`
-   remove type guard from equality checks? (like jsonEquals)
