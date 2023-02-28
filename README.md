# augment-vir

This is a mono-repo for the `@augment-vir` packages on npm.

## Dev setup

1. clone the repo
2. `npm i`: install dependencies
3. `npm run compile`: build all packages (this is often necessary before doing anything else because the packages depend on each other's built outputs)

## Dev test workflow

1. make change
2. if change is in a package outside of the one being tested, run `npm run compile` in the repo root
3. run `npm test` in the package to be tested (or in the repo root to run _all_ tests)
4. run `npm run test:all` to test _everything_ (including formatting and spelling).
