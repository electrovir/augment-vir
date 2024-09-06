## @augment-vir/common

-   `flatten2dArray`: removed. Use [`[].flat()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/flat).
-   `AtLeastOneEntryArray`: removed. Use `AtLeastTuple`.
-   `typedArrayIncludes`: removed. Use `check.isIn` from `@augment-vir/assert` instead.
-   `arrayToObject`: the callback must now provide both key and value.
-   `getEnumTypedValues`: renamed to `getEnumValues`.
-   `getEnumTypedKeys`: removed. Use `getEnumValues` instead.
-   `isEnumValue`: removed. Use `check.isEnumValue` from `@augment-vir/assert` instead.
-   `ensureEnum`: removed. Use `assertWrap.isEnumValue` from `@augment-vir/assert` instead.
-   `filterToEnumValues`: removed third `caseInsensitive` input.
-   `hasKey`: removed. Use `check.hasKey` from `@augment-vir/assert` instead.
-   `isKeyof`: removed. Use `check.isKeyOf` from `@augment-vir/assert` instead.
-   `mapObjectValuesSync`: no longer needs to be curried.
-   `PartialAndNullable`: renamed to `PartialWithNullable`.
-   `PartialAndUndefined`: renamed to `PartialWithUndefined`.
-   `isObject`: removed. Use `check.isObject` from `@augment-vir/assert` instead.
-   `PropertyValueType`: renamed to `Values`.
-   `RemovePartial`: improved and renamed to `CompleteRequire`.
-   `PickDeep`: removed entirely. Use the `PickSelection` pattern instead.
-   `typedHasProperty`: removed. Use `check.hasValue` from `@augment-vir/assert` instead.
-   `typedHasProperties`: removed. Use `check.hasValues` from `@augment-vir/assert` instead.
-   `createDeferredPromiseWrapper`: refactored into a class: `DeferredPromise`.
-   `isPromiseLike`: removed. Use `check.isPromiseLike` from `@augment-vir/assert` instead.
-   `executeWithRetries`: renamed to `callWithRetries`.
-   `waitUntilTruthy`: removed. Use `waitUntil.isTruthy` from `@augment-vir/assert` instead.
-   `isUuid`: removed. Use `check.isUuid` from `@augment-vir/assert` instead.
-   `ansiRegex`: renamed to `ansiRegExp`.
-   `isTruthy`: removed. Use `check.isTruthy` from `@augment-vir/assert` instead.
-   `isFalsy`: moved to `@augment-vir/assert`.
-   `doesRequireScientificNotation`: renamed to `requiresScientificNotation`.
-   `ensureMinAndMax`: renamed to `ensureMinMax`
-   `convertIntoNumber`: removed. Use `toNumber`.
-   `wrapNumber`: `value` is now the standalone first input.
-   `round`: `value` is now the standalone first input.
-   `clamp`: `value` is now the standalone first input.
-   `removeCommasFromNumberString`: renamed to `removeCommas`.
-   `makeCaseInsensitiveRegExp`: removed. Use `setRegExpCaseSensitivity` instead.
-   `getAllIndexesOf`: renamed to `getSubstringIndexes`.
-   `typedSplit`: renamed to `safeSplit`.
-   `createDebounce`: refactored into a class, `Debounce`.
-   `isBrowser`: removed. Use `isRuntimeEnv(RuntimeEnv.Web)` instead.
-   `combineErrors`: always returns an `Error` now.
-   `combineErrorMessages`: now takes string inputs and is smarter about combinations.
-   `JsonCompatiblePrimitiveValue`: renamed to just `JsonCompatiblePrimitive`.
-   `stringifyJson`: removed. Use `stringify` or just `JSON.stringify` instead.
-   `parseJson`: removed. Use `JSON.parse` instead.
-   `deDupeRegExFlags`: removed. Use `removeDuplicateCharacters` instead.
-   `timeCallback`: renamed to `measureExecutionDuration`.
-   `isLengthAtLeast`: removed. Use `check.isLengthAtLeast` from `@augment-vir/assert` instead.
-   `assertLengthAtLeast`: removed. Use `assert.isLengthAtLeast` from `@augment-vir/assert` instead.
-   `Writeable`: renamed to `Writable`.
-   `DeepWriteable`: renamed to `WritableDeep`.
-   `RequiredBy`: renamed to `SetRequired`.
-   `RequiredAndNotNullBy`: renamed to `SetRequiredAndNotNull`.
-   `IfEquals`: moved to `@augment-vir/assert`.
-   `wrapNarrowTypeWithTypeCheck`: removed. Use TypeScript's built-in [`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) instead.
-   `NoInfer`: removed. Use TypeScript's built-in [`NoInfer`](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4/#the-noinfer-utility-type) instead, with a default type parameter of `never`.
-   `Public`: removed.

## @augment-vir/browser

Deprecated. Renamed to `@augment-vir/web`.

-   `findOverflowParent`: renamed to `findOverflowAncestor`
-   `queryChildren`: removed. Use `queryThroughShadow` instead.
-   `shuffleArray`: moved to `@augment-vir/common`

## @augment-vir/browser-testing

Deprecated. All functionality moved to the `testWeb` export from `@augment-vir/test`.

## @augment-vir/chai

Deprecated. All functionality moved to `@augment-vir/test`.

## @augment-vir/docker

Deprecated. All functionality moved to the `docker` export from `@augment-vir/node`.

## @augment-vir/node-js

Deprecated. Renamed to `@augment-vir/node`.

-   `shuffleArray`: moved to `@augment-vir/common`
-   All log related exports moved to `@augment-vir/common`

## @augment-vir/prisma-node-js

Deprecated. Types moved to `@augment-vir/common`. Functionality moved to the `prisma` export from `@augment-vir/node`.

## @augment-vir/testing

Deprecated. Use `@augment-vir/test` instead.
