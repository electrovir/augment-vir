import {type MaybePromise, type NarrowToExpected, stringify} from '@augment-vir/core';
import deepEqual from 'deep-eql';
import {AssertionError} from '../../augments/assertion.error.js';
import type {GuardGroup} from '../../guard-types/guard-group.js';
import {autoGuard, autoGuardSymbol} from '../../guard-types/guard-override.js';
import {type WaitUntilOptions} from '../../guard-types/wait-until-function.js';

export function strictEquals<const Actual, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is Expected {
    if (actual !== expected) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\ndoes not strictly equal\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}
function notStrictEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (actual === expected) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\nstrictly equals\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

function looseEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (actual != expected) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\ndoes not loosely equal\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

function notLooseEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (actual == expected) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\nloosely equals\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

export function deepEquals<const Actual, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is NarrowToExpected<Actual, Expected> {
    if (!deepEqual(actual, expected)) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\ndoes not deeply equal\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

function notDeepEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    if (deepEqual(actual, expected)) {
        throw new AssertionError(
            `\n\n${stringify(actual)}\n\ndeeply equals\n\n${stringify(expected)}\n\n`,
            failureMessage,
        );
    }
}

const assertions: {
    /**
     * Asserts that two values are strictly equal (using
     * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
     *
     * Type guards the first value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.strictEquals('a', 'a'); // passes
     *
     * assert.strictEquals('1', 1); // fails
     *
     * assert.strictEquals({a: 'a'}, {a: 'a'}); // fails
     *
     * const objectExample = {a: 'a'};
     * assert.strictEquals(objectExample, objectExample); // passes
     * ```
     *
     * @throws {@link AssertionError} If both inputs are not strictly equal.
     * @see
     * - {@link assert.notStrictEquals} : the opposite assertion.
     * - {@link assert.looseEquals} : the loose equality assertion.
     */
    strictEquals: typeof strictEquals;
    /**
     * Asserts that two values are _not_ strictly equal (using
     * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.notStrictEquals('a', 'a'); // fails
     *
     * assert.notStrictEquals('1', 1); // passes
     *
     * assert.notStrictEquals({a: 'a'}, {a: 'a'}); // passes
     *
     * const objectExample = {a: 'a'};
     * assert.notStrictEquals(objectExample, objectExample); // fails
     * ```
     *
     * @throws {@link AssertionError} If both inputs are strictly equal.
     * @see
     * - {@link assert.strictEquals} : the opposite assertion.
     * - {@link assert.notLooseEquals} : the loose equality assertion.
     */
    notStrictEquals: typeof notStrictEquals;

    /**
     * Asserts that two values are loosely equal (using
     * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
     *
     * Type guards the first value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.looseEquals('a', 'a'); // passes
     *
     * assert.looseEquals('1', 1); // passes
     *
     * assert.looseEquals({a: 'a'}, {a: 'a'}); // fails
     *
     * const objectExample = {a: 'a'};
     * assert.looseEquals(objectExample, objectExample); // passes
     * ```
     *
     * @throws {@link AssertionError} If both inputs are not loosely equal.
     * @see
     * - {@link assert.notLooseEquals} : the opposite assertion.
     * - {@link assert.strictEquals} : the strict equality assertion.
     */
    looseEquals: typeof looseEquals;
    /**
     * Asserts that two values are _not_ loosely equal (using
     * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.notLooseEquals('a', 'a'); // fails
     *
     * assert.notLooseEquals('1', 1); // fails
     *
     * assert.notLooseEquals({a: 'a'}, {a: 'a'}); // passes
     *
     * const objectExample = {a: 'a'};
     * assert.notLooseEquals(objectExample, objectExample); // fails
     * ```
     *
     * @throws {@link AssertionError} If both inputs are loosely equal.
     * @see
     * - {@link assert.looseEquals} : the opposite assertion.
     * - {@link assert.strictEquals} : the strict equality assertion.
     */
    notLooseEquals: typeof notLooseEquals;

    /**
     * Asserts that two values are deeply equal using the
     * [deep-eql](https://www.npmjs.com/package/deep-eql) package.
     *
     * Note that this check may be _expensive_, depending on what values it is passed. Whenever
     * possible, use simpler equality checks instead (see the **see** section below).
     *
     * Type guards the first value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.deepEquals('a', 'a'); // passes
     *
     * assert.deepEquals('1', 1); // fails
     *
     * assert.deepEquals({a: 'a'}, {a: 'a'}); // passes
     *
     * const objectExample = {a: 'a'};
     * assert.deepEquals(objectExample, objectExample); // passes
     * ```
     *
     * @throws {@link AssertionError} If both inputs are not deeply equal.
     * @see
     * - {@link assert.notDeepEquals} : the opposite assertion.
     * - {@link assert.entriesEqual} : a less expensive (but less thorough) deep equality assertion.
     * - {@link assert.jsonEquals} : a less expensive (but less thorough) deep equality assertion.
     */
    deepEquals: typeof deepEquals;
    /**
     * Asserts that two values are _not_ deeply equal using the
     * [deep-eql](https://www.npmjs.com/package/deep-eql) package.
     *
     * Note that this check may be _expensive_, depending on what values it is passed. Whenever
     * possible, use simpler equality checks instead (see the **see** section below).
     *
     * Type guards the first value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.deepEquals('a', 'a'); // false
     *
     * assert.deepEquals('1', 1); // passes
     *
     * assert.deepEquals({a: 'a'}, {a: 'a'}); // fails
     *
     * const objectExample = {a: 'a'};
     * assert.deepEquals(objectExample, objectExample); // fails
     * ```
     *
     * @throws {@link AssertionError} If both inputs are deeply equal.
     * @see
     * - {@link assert.notDeepEquals} : the opposite assertion.
     * - {@link assert.entriesEqual} : a less expensive (but less thorough) deep equality assertion.
     * - {@link assert.jsonEquals} : a less expensive (but less thorough) deep equality assertion.
     */
    notDeepEquals: typeof notDeepEquals;
} = {
    strictEquals,
    notStrictEquals,
    looseEquals,
    notLooseEquals,
    deepEquals,
    notDeepEquals,
};

export const simpleEqualityGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that two values are strictly equal (using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.strictEquals('a', 'a'); // true
         *
         * check.strictEquals('1', 1); // false
         *
         * check.strictEquals({a: 'a'}, {a: 'a'}); // false
         *
         * const objectExample = {a: 'a'};
         * check.strictEquals(objectExample, objectExample); // true
         * ```
         *
         * @see
         * - {@link check.notStrictEquals} : the opposite check.
         * - {@link check.looseEquals} : the loose equality check.
         */
        strictEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => actual is Expected
            >(),
        /**
         * Checks that two values are _not_ strictly equal (using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.notStrictEquals('a', 'a'); // false
         *
         * check.notStrictEquals('1', 1); // true
         *
         * check.notStrictEquals({a: 'a'}, {a: 'a'}); // true
         *
         * const objectExample = {a: 'a'};
         * check.notStrictEquals(objectExample, objectExample); // false
         * ```
         *
         * @see
         * - {@link check.strictEquals} : the opposite check.
         * - {@link check.notLooseEquals} : the loose equality check.
         */
        notStrictEquals: autoGuardSymbol,
        /**
         * Checks that two values are loosely equal (using
         * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.looseEquals('a', 'a'); // true
         *
         * check.looseEquals('1', 1); // true
         *
         * check.looseEquals({a: 'a'}, {a: 'a'}); // false
         *
         * const objectExample = {a: 'a'};
         * check.looseEquals(objectExample, objectExample); // true
         * ```
         *
         * @see
         * - {@link check.notLooseEquals} : the opposite check.
         * - {@link check.strictEquals} : the strict equality check.
         */
        looseEquals: autoGuardSymbol,
        /**
         * Checks that two values are _not_ loosely equal (using
         * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.notLooseEquals('a', 'a'); // false
         *
         * check.notLooseEquals('1', 1); // false
         *
         * check.notLooseEquals({a: 'a'}, {a: 'a'}); // true
         *
         * const objectExample = {a: 'a'};
         * check.notLooseEquals(objectExample, objectExample); // false
         * ```
         *
         * @see
         * - {@link check.looseEquals} : the opposite check.
         * - {@link check.strictEquals} : the strict equality check.
         */
        notLooseEquals: autoGuardSymbol,
        /**
         * Checks that two values are deeply equal using the
         * [deep-eql](https://www.npmjs.com/package/deep-eql) package.
         *
         * Note that this check may be _expensive_, depending on what values it is passed. Whenever
         * possible, use simpler equality checks instead (see the **see** section below).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.deepEquals('a', 'a'); // true
         *
         * check.deepEquals('1', 1); // false
         *
         * check.deepEquals({a: 'a'}, {a: 'a'}); // true
         *
         * const objectExample = {a: 'a'};
         * check.deepEquals(objectExample, objectExample); // true
         * ```
         *
         * @see
         * - {@link check.notDeepEquals} : the opposite check.
         * - {@link check.entriesEqual} : a less expensive (but less thorough) deep equality check.
         * - {@link check.jsonEquals} : a less expensive (but less thorough) deep equality check.
         */
        deepEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => actual is Expected
            >(),
        /**
         * Checks that two values are _not_ deeply equal using the
         * [deep-eql](https://www.npmjs.com/package/deep-eql) package.
         *
         * Note that this check may be _expensive_, depending on what values it is passed. Whenever
         * possible, use simpler equality checks instead (see the **see** section below).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.deepEquals('a', 'a'); // false
         *
         * check.deepEquals('1', 1); // true
         *
         * check.deepEquals({a: 'a'}, {a: 'a'}); // false
         *
         * const objectExample = {a: 'a'};
         * check.deepEquals(objectExample, objectExample); // false
         * ```
         *
         * @see
         * - {@link check.notDeepEquals} : the opposite check.
         * - {@link check.entriesEqual} : a less expensive (but less thorough) deep equality check.
         * - {@link check.jsonEquals} : a less expensive (but less thorough) deep equality check.
         */
        notDeepEquals: autoGuardSymbol,
    },
    assertWrap: {
        /**
         * Asserts that two values are strictly equal (using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
         * Returns the first value if the assertion passes.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.strictEquals('a', 'a'); // returns `'a'`
         *
         * assertWrap.strictEquals('1', 1); // throws an error
         *
         * assertWrap.strictEquals({a: 'a'}, {a: 'a'}); // throws an error
         *
         * const objectExample = {a: 'a'};
         * assertWrap.strictEquals(objectExample, objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @throws {@link AssertionError} If both inputs are not strictly equal.
         * @see
         * - {@link assertWrap.notStrictEquals} : the opposite assertion.
         * - {@link assertWrap.looseEquals} : the loose equality assertion.
         */
        strictEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected>
            >(),
        /**
         * Asserts that two values are _not_ strictly equal (using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
         * Returns the first value if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.notStrictEquals('a', 'a'); // throws an error
         *
         * assertWrap.notStrictEquals('1', 1); // returns `'1'`
         *
         * assertWrap.notStrictEquals({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * assertWrap.notStrictEquals(objectExample, objectExample); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If both inputs are strictly equal.
         * @see
         * - {@link assertWrap.strictEquals} : the opposite assertion.
         * - {@link assertWrap.notLooseEquals} : the loose equality assertion.
         */
        notStrictEquals: autoGuardSymbol,
        /**
         * Asserts that two values are loosely equal (using
         * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
         * Returns the first value if the assertion passes.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.looseEquals('a', 'a'); // returns `'a'`
         *
         * assertWrap.looseEquals('1', 1); // returns `'1'`
         *
         * assertWrap.looseEquals({a: 'a'}, {a: 'a'}); // throws an error
         *
         * const objectExample = {a: 'a'};
         * assertWrap.looseEquals(objectExample, objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @throws {@link AssertionError} If both inputs are not loosely equal.
         * @see
         * - {@link assertWrap.notLooseEquals} : the opposite assertion.
         * - {@link assertWrap.strictEquals} : the strict equality assertion.
         */
        looseEquals: autoGuardSymbol,
        /**
         * Asserts that two values are _not_ loosely equal (using
         * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
         * Returns the first value if the assertion passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.notLooseEquals('a', 'a'); // throws an error
         *
         * assertWrap.notLooseEquals('1', 1); // throws an error
         *
         * assertWrap.notLooseEquals({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * assertWrap.notLooseEquals(objectExample, objectExample); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If both inputs are loosely equal.
         * @see
         * - {@link assertWrap.looseEquals} : the opposite assertion.
         * - {@link assertWrap.strictEquals} : the strict equality assertion.
         */
        notLooseEquals: autoGuardSymbol,

        /**
         * Asserts that two values are deeply equal using the
         * [deep-eql](https://www.npmjs.com/package/deep-eql) package. Returns the first value if
         * the assertion passes.
         *
         * Note that this check may be _expensive_, depending on what values it is passed. Whenever
         * possible, use simpler equality checks instead (see the **see** section below).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.deepEquals('a', 'a'); // returns `'a'`
         *
         * assertWrap.deepEquals('1', 1); // throws an error
         *
         * assertWrap.deepEquals({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * assertWrap.deepEquals(objectExample, objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @throws {@link AssertionError} If both inputs are not deeply equal.
         * @see
         * - {@link assertWrap.notDeepEquals} : the opposite assertion.
         * - {@link assertWrap.entriesEqual} : a less expensive (but less thorough) deep equality assertion.
         * - {@link assertWrap.jsonEquals} : a less expensive (but less thorough) deep equality assertion.
         */
        deepEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected>
            >(),
        /**
         * Asserts that two values are _not_ deeply equal using the
         * [deep-eql](https://www.npmjs.com/package/deep-eql) package. Returns the first value if
         * the assertion passes.
         *
         * Note that this check may be _expensive_, depending on what values it is passed. Whenever
         * possible, use simpler equality checks instead (see the **see** section below).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.deepEquals('a', 'a'); // returns `'a'`
         *
         * assertWrap.deepEquals('1', 1); // throws an error
         *
         * assertWrap.deepEquals({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * assertWrap.deepEquals(objectExample, objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @throws {@link AssertionError} If both inputs are deeply equal.
         * @see
         * - {@link assertWrap.notDeepEquals} : the opposite assertion.
         * - {@link assertWrap.entriesEqual} : a less expensive (but less thorough) deep equality assertion.
         * - {@link assertWrap.jsonEquals} : a less expensive (but less thorough) deep equality assertion.
         */
        notDeepEquals: autoGuardSymbol,
    },
    checkWrap: {
        /**
         * Checks that two values are strictly equal (using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
         * Returns the first value if the check passes, otherwise `undefined`.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.strictEquals('a', 'a'); // returns `'a'`
         *
         * checkWrap.strictEquals('1', 1); // returns `undefined`
         *
         * checkWrap.strictEquals({a: 'a'}, {a: 'a'}); // returns `undefined`
         *
         * const objectExample = {a: 'a'};
         * checkWrap.strictEquals(objectExample, objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.notStrictEquals} : the opposite check.
         * - {@link checkWrap.looseEquals} : the loose equality check.
         */
        strictEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => Expected | undefined
            >(),
        /**
         * Checks that two values are _not_ strictly equal (using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using)).
         * Returns the first value if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.notStrictEquals('a', 'a'); // returns `undefined`
         *
         * checkWrap.notStrictEquals('1', 1); // returns `'1'`
         *
         * checkWrap.notStrictEquals({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * checkWrap.notStrictEquals(objectExample, objectExample); // returns `undefined`
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.strictEquals} : the opposite check.
         * - {@link checkWrap.notLooseEquals} : the loose equality check.
         */
        notStrictEquals: autoGuardSymbol,
        /**
         * Checks that two values are loosely equal (using
         * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
         * Returns the first value if the check passes, otherwise `undefined`.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.looseEquals('a', 'a'); // returns `'a'`
         *
         * checkWrap.looseEquals('1', 1); // returns `'1'`
         *
         * checkWrap.looseEquals({a: 'a'}, {a: 'a'}); // returns `undefined`
         *
         * const objectExample = {a: 'a'};
         * checkWrap.looseEquals(objectExample, objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.notLooseEquals} : the opposite check.
         * - {@link checkWrap.strictEquals} : the strict equality check.
         */
        looseEquals: autoGuardSymbol,
        /**
         * Checks that two values are _not_ loosely equal (using
         * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using)).
         * Returns the first value if the check passes, otherwise `undefined`.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.notLooseEquals('a', 'a'); // returns `undefined`
         *
         * checkWrap.notLooseEquals('1', 1); // returns `undefined`
         *
         * checkWrap.notLooseEquals({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * checkWrap.notLooseEquals(objectExample, objectExample); // returns `undefined`
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.looseEquals} : the opposite check.
         * - {@link checkWrap.strictEquals} : the strict equality check.
         */
        notLooseEquals: autoGuardSymbol,
        /**
         * Checks that two values are deeply equal using the
         * [deep-eql](https://www.npmjs.com/package/deep-eql) package. Returns the first value if
         * the check passes.
         *
         * Note that this check may be _expensive_, depending on what values it is passed. Whenever
         * possible, use simpler equality checks instead (see the **see** section below).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.deepEquals('a', 'a'); // true
         *
         * checkWrap.deepEquals('1', 1); // false
         *
         * checkWrap.deepEquals({a: 'a'}, {a: 'a'}); // true
         *
         * const objectExample = {a: 'a'};
         * checkWrap.deepEquals(objectExample, objectExample); // true
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.notDeepEquals} : the opposite check.
         * - {@link checkWrap.entriesEqual} : a less expensive (but less thorough) deep equality check.
         * - {@link checkWrap.jsonEquals} : a less expensive (but less thorough) deep equality check.
         */
        deepEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => NarrowToExpected<Actual, Expected> | undefined
            >(),
        /**
         * Checks that two values are _not_ deeply equal using the
         * [deep-eql](https://www.npmjs.com/package/deep-eql) package. Returns the first value if
         * the check passes.
         *
         * Note that this check may be _expensive_, depending on what values it is passed. Whenever
         * possible, use simpler equality checks instead (see the **see** section below).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.deepEquals('a', 'a'); // false
         *
         * checkWrap.deepEquals('1', 1); // true
         *
         * checkWrap.deepEquals({a: 'a'}, {a: 'a'}); // false
         *
         * const objectExample = {a: 'a'};
         * checkWrap.deepEquals(objectExample, objectExample); // false
         * ```
         *
         * @returns The first value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.notDeepEquals} : the opposite check.
         * - {@link checkWrap.entriesEqual} : a less expensive (but less thorough) deep equality check.
         * - {@link checkWrap.jsonEquals} : a less expensive (but less thorough) deep equality check.
         */
        notDeepEquals: autoGuardSymbol,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output strictly equals (using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * the first input. Once the callback output passes, it is returned. If the attempts time
         * out, an error is thrown.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.strictEquals('a', () => 'a'); // returns `'a'`
         *
         * await waitUntil.strictEquals(1, () => '1'); // throws an error
         *
         * await waitUntil.strictEquals({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // throws an error
         *
         * const objectExample = {a: 'a'};
         * await waitUntil.strictEquals(objectExample, () => objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.notStrictEquals} : the opposite assertion.
         * - {@link waitUntil.looseEquals} : the loose equality assertion.
         */
        strictEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    expected: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected>>
            >(),
        /**
         * Repeatedly calls a callback until its output does _not_ strictly equal (using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * the first input. Once the callback output passes, it is returned. If the attempts time
         * out, an error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.notStrictEquals('a', () => 'a'); // throws an error
         *
         * await waitUntil.notStrictEquals(1, () => '1'); // returns `'1'`
         *
         * await waitUntil.notStrictEquals({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * await waitUntil.notStrictEquals(objectExample, () => objectExample); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.strictEquals} : the opposite assertion.
         * - {@link waitUntil.notLooseEquals} : the loose equality assertion.
         */
        notStrictEquals: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output loosely equals (using
         * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using))
         * the first input. Once the callback output passes, it is returned. If the attempts time
         * out, an error is thrown.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.looseEquals('a', () => 'a'); // returns `'a'`
         *
         * await waitUntil.looseEquals(1, () => '1'); // returns `'1'`
         *
         * await waitUntil.looseEquals({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // throws an error
         *
         * const objectExample = {a: 'a'};
         * await waitUntil.looseEquals(objectExample, () => objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.notLooseEquals} : the opposite assertion.
         * - {@link waitUntil.strictEquals} : the strict equality assertion.
         */
        looseEquals: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output does _not_ loosely equal (using
         * [`==`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using))
         * the first input. Once the callback output passes, it is returned. If the attempts time
         * out, an error is thrown.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.notLooseEquals('a', () => 'a'); // throws an error
         *
         * await waitUntil.notLooseEquals(1, () => '1'); // throws an error
         *
         * await waitUntil.notLooseEquals({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * await waitUntil.notLooseEquals(objectExample, () => objectExample); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.looseEquals} : the opposite assertion.
         * - {@link waitUntil.notStrictEquals} : the strict equality assertion.
         */
        notLooseEquals: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output deeply equals (using the
         * [deep-eql](https://www.npmjs.com/package/deep-eql) package) the first input. Once the
         * callback output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Note that this check may be _expensive_, depending on what values it is passed. Whenever
         * possible, use simpler equality checks instead (see the **see** section below).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.deepEquals('a', () => 'a'); // returns `'a'`
         *
         * await waitUntil.deepEquals(1, () => '1'); // throws an error
         *
         * await waitUntil.deepEquals({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // returns `{a: 'a'}`
         *
         * const objectExample = {a: 'a'};
         * await waitUntil.deepEquals(objectExample, () => objectExample); // returns `{a: 'a'}`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.notDeepEquals} : the opposite assertion.
         * - {@link waitUntil.entriesEqual} : a less expensive (but less thorough) deep equality assertion.
         * - {@link waitUntil.jsonEquals} : a less expensive (but less thorough) deep equality assertion.
         */
        deepEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    expected: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected>>
            >(),
        /**
         * Repeatedly calls a callback until its output does _not_ deeply equal (using the
         * [deep-eql](https://www.npmjs.com/package/deep-eql) package) the first input. Once the
         * callback output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Note that this check may be _expensive_, depending on what values it is passed. Whenever
         * possible, use simpler equality checks instead (see the **see** section below).
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.notDeepEquals('a', () => 'a'); // throws an error
         *
         * await waitUntil.notDeepEquals(1, () => '1'); // returns `'1'`
         *
         * await waitUntil.notDeepEquals({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // throws an error
         *
         * const objectExample = {a: 'a'};
         * await waitUntil.notDeepEquals(objectExample, () => objectExample); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.deepEquals} : the opposite assertion.
         * - {@link waitUntil.entriesEqual} : a less expensive (but less thorough) deep equality assertion.
         * - {@link waitUntil.jsonEquals} : a less expensive (but less thorough) deep equality assertion.
         */
        notDeepEquals: autoGuardSymbol,
    },
} satisfies GuardGroup<typeof assertions>;
