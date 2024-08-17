# Todo

## Not now

-   add a pretty diff to the assertion errors like chai has
-   make a snapshot function in `@augment-vir/test` that supports both Node.js's built-in test runner's snapshot testing as well as something that works in web-test-runner.
-   look into using typdoc plugins
    -   https://github.com/Gerrit0/typedoc-plugin-mdn-links
    -   https://github.com/eyworldwide/typedoc-plugin-remove-references
    -   https://github.com/Gerrit0/typedoc-plugin-missing-exports

## Before v30 release

-   `PickSelection` seems to not be supporting auto complete in the second type parameter
-   fill in package.json descriptions
-   convert `Debounce` into an ListenTarget and emit events when:
    -   execute is called with no callback
    -   the callback is triggered
    -   the callback is skipped
-   100% test coverage
-   re-review v30 changelog
-   add other augment-vir packages from v29
-   create a single documentation output
-   add debounce examples

## Immediately after v30 release

-   add `parseJsonWithShape` to `object-shape-tester`
-   finish updating `date-vir`
-   deprecate `run-time-assertions`
