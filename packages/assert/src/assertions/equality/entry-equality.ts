import type {NarrowToExpected} from '@augment-vir/core';
import {AnyObject, MaybePromise, stringify} from '@augment-vir/core';
import {AssertionError} from '../../augments/assertion.error.js';
import type {GuardGroup} from '../../guard-types/guard-group.js';
import {autoGuard, autoGuardSymbol} from '../../guard-types/guard-override.js';
import {WaitUntilOptions} from '../../guard-types/wait-until-function.js';
import {strictEquals} from './simple-equality.js';

function entriesEqual<const Actual extends object, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is Expected {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!actual || typeof actual !== 'object') {
        throw new AssertionError(`${stringify(actual)} is not an object.`, failureMessage);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (!expected || typeof expected !== 'object') {
        throw new AssertionError(`${stringify(expected)} is not an object.`, failureMessage);
    }

    const allKeys = Array.from(
        new Set([
            ...Reflect.ownKeys(actual),
            ...Reflect.ownKeys(expected),
        ]),
    );

    allKeys.forEach((key) => {
        const actualValue = (actual as AnyObject)[key];
        const expectedValue = (expected as AnyObject)[key];

        try {
            strictEquals(actualValue, expectedValue);
        } catch {
            throw new AssertionError(
                `Entries are not equal at key '${String(key)}'.`,
                failureMessage,
            );
        }
    });
}

function notEntriesEqual(actual: object, expected: object, failureMessage?: string | undefined) {
    try {
        entriesEqual(actual, expected);
    } catch {
        return;
    }

    throw new AssertionError('Entries are equal.', failureMessage);
}

const assertions: {
    /**
     * Asserts that two objects are deeply equal by checking only their top-level values for strict
     * (non-deep, reference, using
     * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
     * equality.
     *
     * Type guards the first value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.entriesEqual({a: 'a'}, {a: 'a'}); // passes
     *
     * assert.entriesEqual({a: {b: 'b'}}, {a: {b: 'b'}}); // fails
     *
     * const bExample = {b: 'b'};
     * assert.entriesEqual({a: bExample}, {a: bExample}); // passes
     * ```
     *
     * @throws {@link AssertionError} If both inputs are not equal.
     * @see
     * - {@link assert.notEntriesEqual} : the opposite assertion.
     * - {@link assert.jsonEquals} : another deep equality assertion.
     * - {@link assert.deepEquals} : the most thorough (but also slow) deep equality assertion.
     */
    entriesEqual: typeof entriesEqual;
    /**
     * Asserts that two objects are _not_ deeply equal by checking only their top-level values for
     * strict (non-deep, reference, using
     * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
     * equality.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.notEntriesEqual({a: 'a'}, {a: 'a'}); // fails
     *
     * assert.notEntriesEqual({a: {b: 'b'}}, {a: {b: 'b'}}); // passes
     *
     * const bExample = {b: 'b'};
     * assert.notEntriesEqual({a: bExample}, {a: bExample}); // fails
     * ```
     *
     * @throws {@link AssertionError} If both inputs are equal.
     * @see
     * - {@link assert.entriesEqual} : the opposite assertion.
     * - {@link assert.notJsonEquals} : another not deep equality assertion.
     * - {@link assert.notDeepEquals} : the most thorough (but also slow) not deep equality assertion.
     */
    notEntriesEqual: typeof notEntriesEqual;
} = {
    entriesEqual,
    notEntriesEqual,
};

export const entryEqualityGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that two objects are deeply equal by checking only their top-level values for
         * strict (non-deep, reference, using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * equality.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.entriesEqual({a: 'a'}, {a: 'a'}); // true
         *
         * check.entriesEqual({a: {b: 'b'}}, {a: {b: 'b'}}); // false
         *
         * const bExample = {b: 'b'};
         * check.entriesEqual({a: bExample}, {a: bExample}); // true
         * ```
         *
         * @see
         * - {@link check.notEntriesEqual} : the opposite check.
         * - {@link check.jsonEquals} : another deep equality check.
         * - {@link check.deepEquals} : the most thorough (but also slow) deep equality check.
         */
        entriesEqual:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => actual is Expected
            >(),
        /**
         * Checks that two objects are _not_ deeply equal by checking only their top-level values
         * for strict (non-deep, reference, using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * equality.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.notEntriesEqual({a: 'a'}, {a: 'a'}); // false
         *
         * check.notEntriesEqual({a: {b: 'b'}}, {a: {b: 'b'}}); // true
         *
         * const bExample = {b: 'b'};
         * check.notEntriesEqual({a: bExample}, {a: bExample}); // false
         * ```
         *
         * @see
         * - {@link check.entriesEqual} : the opposite check.
         * - {@link check.notJsonEquals} : another not deep equality check.
         * - {@link check.notDeepEquals} : the most thorough (but also slow) not deep equality check.
         */
        notEntriesEqual: autoGuardSymbol,
    },
    assertWrap: {
        /**
         * Asserts that two objects are deeply equal by checking only their top-level values for
         * strict (non-deep, reference, using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * equality and, if so, returns the first object.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.entriesEqual({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * assertWrap.entriesEqual({a: {b: 'b'}}, {a: {b: 'b'}}); // throws an error
         *
         * const bExample = {b: 'b'};
         * assertWrap.entriesEqual({a: bExample}, {a: bExample}); // returns `{a: {b: 'b'}}`
         * ```
         *
         * @returns The first input if the assertion passes.
         * @throws {@link AssertionError} If both inputs are not equal.
         * @see
         * - {@link assertWrap.notEntriesEqual} : the opposite assertion.
         * - {@link assertWrap.jsonEquals} : another deep equality assertion.
         * - {@link assertWrap.deepEquals} : the most thorough (but also slow) deep equality assertion.
         */
        entriesEqual:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected>
            >(),
        /**
         * Asserts that two objects are _not_ deeply equal by checking only their top-level values
         * for strict (non-deep, reference, using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * equality and, if so, returns the first object.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.notEntriesEqual({a: 'a'}, {a: 'a'}); // throws an error
         *
         * assertWrap.notEntriesEqual({a: {b: 'b'}}, {a: {b: 'b'}}); // returns `{a: {b: 'b'}}`
         *
         * const bExample = {b: 'b'};
         * assertWrap.notEntriesEqual({a: bExample}, {a: bExample}); // throws an error
         * ```
         *
         * @returns The first input if the assertion passes.
         * @throws {@link AssertionError} If both inputs are equal.
         * @see
         * - {@link assertWrap.entriesEqual} : the opposite assertion.
         * - {@link assertWrap.notJsonEquals} : another not deep equality assertion.
         * - {@link assertWrap.notDeepEquals} : the most thorough (but also slow) not deep equality assertion.
         */
        notEntriesEqual: autoGuardSymbol,
    },
    checkWrap: {
        /**
         * Checks that two objects are deeply equal by checking only their top-level values for
         * strict (non-deep, reference, using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * equality. If the check passes the first object is returned. If not, `undefined` is
         * returned.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.entriesEqual({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * checkWrap.entriesEqual({a: {b: 'b'}}, {a: {b: 'b'}}); // returns `undefined`
         *
         * const bExample = {b: 'b'};
         * checkWrap.entriesEqual({a: bExample}, {a: bExample}); // returns `{a: {b: 'b'}}`
         * ```
         *
         * @returns The first input if the assertion passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.notEntriesEqual} : the opposite check.
         * - {@link checkWrap.jsonEquals} : another deep equality check.
         * - {@link checkWrap.deepEquals} : the most thorough (but also slow) deep equality check.
         */
        entriesEqual:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => NarrowToExpected<Actual, Expected> | undefined
            >(),

        /**
         * Checks that two objects are _not_ deeply equal by checking only their top-level values
         * for strict (non-deep, reference, using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * equality. If the check passes the first object is returned. If not, `undefined` is
         * returned.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.notEntriesEqual({a: 'a'}, {a: 'a'}); // returns `undefined`
         *
         * checkWrap.notEntriesEqual({a: {b: 'b'}}, {a: {b: 'b'}}); // returns `{a: {b: 'b'}}`
         *
         * const bExample = {b: 'b'};
         * checkWrap.notEntriesEqual({a: bExample}, {a: bExample}); // returns `undefined`
         * ```
         *
         * @returns The first input if the assertion passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.entriesEqual} : the opposite check.
         * - {@link checkWrap.notJsonEquals} : another not deep equality check.
         * - {@link checkWrap.notDeepEquals} : the most thorough (but also slow) not deep equality check.
         */
        notEntriesEqual: autoGuardSymbol,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is deeply equal to the first input by
         * checking only their top-level values for strict (non-deep, reference, using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * equality. Once the callback output passes, it is returned. If the attempts time out, an
         * error is thrown.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.entriesEqual({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // returns `{a: 'a'}`
         *
         * await waitUntil.entriesEqual({a: {b: 'b'}}, () => {
         *     return {a: {b: 'b'}};
         * }); // throws an error
         *
         * const bExample = {b: 'b'};
         * await waitUntil.entriesEqual({a: bExample}, () => {
         *     return {a: bExample};
         * }); // returns `{a: {b: 'b'}}`
         * ```
         *
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.notEntriesEqual} : the opposite assertion.
         * - {@link waitUntil.jsonEquals} : another deep equality assertion.
         * - {@link waitUntil.deepEquals} : the most thorough (but also slow) deep equality assertion.
         */
        entriesEqual:
            autoGuard<
                <Actual, Expected extends Actual>(
                    expected: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected>>
            >(),

        /**
         * Repeatedly calls a callback until its output is _not_ deeply equal to the first input by
         * checking only their top-level values for strict (non-deep, reference, using
         * [`===`](https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using))
         * equality. Once the callback output passes, it is returned. If the attempts time out, an
         * error is thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.notEntriesEqual({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // throws an error
         *
         * await waitUntil.notEntriesEqual({a: {b: 'b'}}, () => {
         *     return {a: {b: 'b'}};
         * }); // returns `{a: {b: 'b'}}`
         *
         * const bExample = {b: 'b'};
         * await waitUntil.notEntriesEqual({a: bExample}, () => {
         *     return {a: bExample};
         * }); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If both inputs are equal.
         * @see
         * - {@link waitUntil.entriesEqual} : the opposite assertion.
         * - {@link waitUntil.notJsonEquals} : another not deep equality assertion.
         * - {@link waitUntil.notDeepEquals} : the most thorough (but also slow) not deep equality assertion.
         */
        notEntriesEqual: autoGuardSymbol,
    },
} satisfies GuardGroup<typeof assertions>;
