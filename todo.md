# Todo

## Not now

-   add a pretty diff to the assertion errors like chai has
-   make a snapshot function in `@augment-vir/test` that supports both Node.js's built-in test runner's snapshot testing as well as something that works in web-test-runner.
-   look into using typdoc plugins
    -   https://github.com/Gerrit0/typedoc-plugin-mdn-links
    -   https://github.com/eyworldwide/typedoc-plugin-remove-references
    -   https://github.com/Gerrit0/typedoc-plugin-missing-exports
-   convert `Debounce` into an ListenTarget and emit events when:
    -   execute is called with no callback
    -   the callback is triggered
    -   the callback is skipped
-   make more node.js augments compatible with common

## Before v30 release

-   `PickSelection` seems to not be supporting auto complete in the second type parameter
-   fill in package.json descriptions
-   re-review v30 changelog
-   add other augment-vir packages from v29
-   create a single documentation output
-   add debounce examples
-   add script that ensure we export all augments
-   write a script that produces a `HttpStatusCode` enum from parsing this page: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#information_responses

## Immediately after v30 release

-   add `parseJsonWithShape` to `object-shape-tester`
-   finish updating `date-vir`
-   deprecate `run-time-assertions`
-   use `ListenTarget` for `ShellEmitter`
-   update `typed-event-target` package
