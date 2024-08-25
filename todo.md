# Todo

## Not now

-   add a pretty diff to the assertion errors like chai has
-   make a snapshot function in `@augment-vir/test` that supports both Node.js's built-in test runner's snapshot testing as well as something that works in web-test-runner.
-   look into using typedoc plugins
    -   https://github.com/Gerrit0/typedoc-plugin-mdn-links
    -   https://github.com/eyworldwide/typedoc-plugin-remove-references
    -   https://github.com/Gerrit0/typedoc-plugin-missing-exports
-   make `isElementVisible` work in more situations (see its stackoverflow link)

## Before v30 release

-   fill in package.json descriptions
-   re-review v30 changelog
-   create a single documentation output
-   make more node.js augments compatible with common
    -   log
    -   appendJson
-   add debounce examples
-   add back docs test

## Immediately after v30 release

-   update `html-spec-tags`
-   add `parseJsonWithShape` to `object-shape-tester`
-   rename `runtimeType` in `object-shape-tester`
-   finish updating `date-vir`
-   deprecate `run-time-assertions`
-   use `ListenTarget` for `ShellEmitter`
-   update `typed-event-target` package
    -   convert `Debounce` into an ListenTarget and emit events when:
        -   execute is called with no callback
        -   the callback is triggered
        -   the callback is skipped
