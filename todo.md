# Todo

## Not now

-   add a pretty diff to the assertion errors like chai has
    -   or at least include functions in the stringify output
-   make a snapshot function in `@augment-vir/test` that supports both Node.js's built-in test runner's snapshot testing as well as something that works in web-test-runner.
-   look into using typedoc plugins
    -   https://github.com/Gerrit0/typedoc-plugin-mdn-links
    -   https://github.com/eyworldwide/typedoc-plugin-remove-references
    -   https://github.com/Gerrit0/typedoc-plugin-missing-exports
-   make `isElementVisible` work in more situations (see its stackoverflow link)
-   reverse engineer how web-test-runner calculates code coverage, because it works really well, and apply it to node test coverage
-   enforce all overrides in `GuardGroup` have (by a `Partial`) matching keys with the given `assertions` object.
    -   this might not be practical/possible because typescript has very strict rules on defining types for assert guards

## Before v30 release

-   fill in package.json descriptions
-   re-review v30 changelog
-   create a single documentation output
    -   add back docs test
-   add debounce examples

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
