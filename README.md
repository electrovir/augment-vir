# augment-vir

Documentation and code for all the current `@augment-vir` packages.

-   [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert): A collection of assertions for test and production code alike. These main exports are the following:
    -   [`assert`](https://electrovir.github.io/augment-vir/functions/assert.html): a collection of assertion methods with type guards when possible. Example: [`assert.isDefined()`](https://electrovir.github.io/augment-vir/functions/assert.html#isDefined)
    -   [`check`](https://electrovir.github.io/augment-vir/functions/check.html): a collection of boolean check methods with type guards when possible. Example: [`check.isBoolean()`](https://electrovir.github.io/augment-vir/functions/check.html#isBoolean)
    -   [`assertWrap`](https://electrovir.github.io/augment-vir/functions/assertWrap.html): a collection of assertions that return the asserted value if the assertion passes. Examples [`assertWrap.isArray()`](https://electrovir.github.io/augment-vir/functions/assertWrap.html#isArray)
    -   [`checkWrap`](https://electrovir.github.io/augment-vir/functions/checkWrap.html): a collection of checks that return the checked value if it passes or `undefined`. Example: [`checkWrap.isInfinite()`](https://electrovir.github.io/augment-vir/functions/checkWrap.html#isInfinite)
    -   [`waitUntil`](https://electrovir.github.io/augment-vir/functions/waitUntil.html): a collection of assertion methods that try to wait until the assertion becomes true. Example: [`waitUntil.isTruthy()`](https://electrovir.github.io/augment-vir/functions/waitUntil.html#isTruthy)
-   [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common): A collection of augments, helpers types, functions, and classes for any JavaScript environment.
    -   Examples: [`filterObject`](https://electrovir.github.io/augment-vir/functions/filterObject.html), [`wait`](https://electrovir.github.io/augment-vir/functions/wait.html), [`getEnumValues`](https://electrovir.github.io/augment-vir/functions/getEnumValues.html)
    -   Includes a colored logger implementation: [`log`](https://electrovir.github.io/augment-vir/variables/log.html)
    -   Includes a SQL-select-like runtime implementation of TypeScript's `Pick`: [`selectFrom`](https://electrovir.github.io/augment-vir/functions/selectFrom-1.html)
    -   Includes Prisma type helpers.
    -   and much more...
-   [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node): A collection of augments, helpers types, functions, and classes only for Node.js (backend) JavaScript environments.
    -   Includes a custom Prisma API built on its CLI: [`prisma`](https://electrovir.github.io/augment-vir/variables/prisma.html).
    -   Includes a custom Docker API built on its CLI: [`docker`](https://electrovir.github.io/augment-vir/variables/docker.html).
    -   Includes an easy to use shell script runner: [`runShellCommand`](https://electrovir.github.io/augment-vir/functions/runShellCommand.html).
    -   and much more!
-   [`@augment-vir/test`](https://www.npmjs.com/package/@augment-vir/test): A universal testing suite that works with Mocha style test runners _and_ Node.js's built-in test runner with the following main exports:
    -   [`describe`](https://electrovir.github.io/augment-vir/functions/describe.html): the normal describe test suite function, automatically imported based on the current environment.
    -   [`it`](https://electrovir.github.io/augment-vir/functions/it.html): the normal it test function, automatically imported based on the current environment.
    -   [`itCases`](https://electrovir.github.io/augment-vir/functions/itCases.html): a succinct way to test lots of inputs and outputs to a single function.
    -   [`testWeb`](https://electrovir.github.io/augment-vir/variables/testWeb.html): a API of web-testing utilities, only available in browser environments.
-   [`@augment-vir/web`](https://www.npmjs.com/package/@augment-vir/web): A collection of augments, helpers types, functions, and classes, that only work in a browser JavaScript environment.
    -   Includes a `querySelector` implementation that works with Shadow DOM: [`queryThroughShadow`](https://electrovir.github.io/augment-vir/functions/queryThroughShadow.html).
    -   Includes an easy way to list all nested children of an element: [`getNestedChildren`](https://electrovir.github.io/augment-vir/functions/getNestedChildren.html).
    -   and much more!
