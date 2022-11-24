# augment-vir

This is a mono-repo for the `@augment-vir` packages on npm.

# Dev test workflow

1. make change
2. if change is in a package outside of the one being tested, run `npm run compile` in the repo root
3. run `npm test` in the package to be tested (or in the repo root to run _all_ tests)
