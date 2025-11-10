# @augment-vir/test

A universal testing suite that works with Mocha style test runners, Node.js's built-in test runner, and Playwright tests with the following main exports:

-   [`describe`](https://electrovir.github.io/augment-vir/functions/describe.html): the normal describe test suite function, automatically imported based on the current environment.
-   [`it`](https://electrovir.github.io/augment-vir/functions/it.html): the normal it test function, automatically imported based on the current environment.
-   [`itCases`](https://electrovir.github.io/augment-vir/functions/itCases.html): a succinct way to test lots of inputs and outputs to a single function.
-   [`testWeb`](https://electrovir.github.io/augment-vir/variables/testWeb.html): a API of web testing utilities, only available in browser environments.
-   [`testPlaywright`](https://electrovir.github.io/augment-vir/variables/testPlaywright.html): a API of Playwright testing utilities, only available in Playwright test environments.

See the docs under `Test`, or `Package: @augment-vir/test` here: https://electrovir.github.io/augment-vir

## Caveats

Playwright does not always set the `PLAYWRIGHT_TEST` env var, especially if you have a playwright config file that imports from TypeScript. If your playwright tests aren't working with this package, try setting `PLAYWRIGHT_TEST="1"` as an env var before calling Playwright (`PLAYWRIGHT_TEST="1" playwright test`).