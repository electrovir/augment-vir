import {AnyObject, extractErrorMessage, MaybePromise, NarrowToExpected} from '@augment-vir/core';
import {AssertionError} from '../../augments/assertion.error.js';
import type {GuardGroup} from '../../guard-types/guard-group.js';
import {autoGuard, autoGuardSymbol} from '../../guard-types/guard-override.js';
import {WaitUntilOptions} from '../../guard-types/wait-until-function.js';

function baseJsonEquals(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

function jsonEquals<const Actual, const Expected extends Actual>(
    actual: Actual,
    expected: Expected,
    failureMessage?: string | undefined,
): asserts actual is Expected {
    try {
        recursiveJsonEquals(actual, expected);
    } catch (error) {
        throw new AssertionError(extractErrorMessage(error), failureMessage);
    }
}

function notJsonEquals(actual: unknown, expected: unknown, failureMessage?: string | undefined) {
    try {
        jsonEquals(actual, expected);
    } catch {
        return;
    }

    throw new AssertionError('Values are JSON equal.', failureMessage);
}

function recursiveJsonEquals(actual: any, expected: any) {
    const isBaseJsonEqual = baseJsonEquals(actual, expected);

    if (actual === expected || isBaseJsonEqual) {
        return;
    }

    if (
        actual != null &&
        expected != null &&
        typeof actual === 'object' &&
        typeof expected === 'object'
    ) {
        const aKeys = Object.keys(actual).sort();
        const bKeys = Object.keys(expected).sort();

        if (aKeys.length || bKeys.length) {
            const areKeysEqual = baseJsonEquals(aKeys, bKeys);

            if (!areKeysEqual) {
                throw new Error('Values are JSON equal.');
            }

            Object.keys(actual).forEach((key) => {
                try {
                    jsonEquals((actual as AnyObject)[key], (expected as AnyObject)[key]);
                } catch (error) {
                    throw new Error(
                        `JSON objects are not equal at key '${key}': ${extractErrorMessage(error)}`,
                    );
                }
            });
        }
    }

    throw new Error('Values are not JSON equal.');
}

const assertions: {
    /**
     * Asserts that two values are deeply equal when stringified into JSON. This will fail or may
     * not make any sense if the values are not valid JSON. This internally sorts all given object
     * keys so it is insensitive to object key order.
     *
     * Type guards the first value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.jsonEquals({a: 'a'}, {a: 'a'}); // passes
     *
     * assert.jsonEquals({a: {b: 'b'}}, {a: {b: 'c'}}); // fails
     * ```
     *
     * @throws {@link AssertionError} If both inputs are not equal.
     * @see
     * - {@link assert.notJsonEquals} : the opposite assertion.
     * - {@link assert.entriesEqual} : another deep equality assertion.
     * - {@link assert.deepEquals} : the most thorough (but also slow) deep equality assertion.
     */
    jsonEquals: typeof jsonEquals;
    /**
     * Asserts that two values are _not_ deeply equal when stringified into JSON. This may not make
     * any sense if the values are not valid JSON. This internally sorts all given object keys so it
     * is insensitive to object key order.
     *
     * Performs no type guarding.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.notJsonEquals({a: 'a'}, {a: 'a'}); // fails
     *
     * assert.notJsonEquals({a: {b: 'b'}}, {a: {b: 'c'}}); // passes
     * ```
     *
     * @throws {@link AssertionError} If both inputs are not equal.
     * @see
     * - {@link assert.jsonEquals} : the opposite assertion.
     * - {@link assert.entriesEqual} : another deep equality assertion.
     * - {@link assert.deepEquals} : the most thorough (but also slow) deep equality assertion.
     */
    notJsonEquals: typeof notJsonEquals;
} = {
    jsonEquals,
    notJsonEquals,
};

export const jsonEqualityGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that two values are deeply equal when stringified into JSON. This will fail or may
         * not make any sense if the values are not valid JSON. This internally sorts all given
         * object keys so it is insensitive to object key order.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.jsonEquals({a: 'a'}, {a: 'a'}); // true
         *
         * check.jsonEquals({a: {b: 'b'}}, {a: {b: 'c'}}); // false
         * ```
         *
         * @see
         * - {@link check.notJsonEquals} : the opposite check.
         * - {@link check.entriesEqual} : another deep equality check.
         * - {@link check.deepEquals} : the most thorough (but also slow) deep equality check.
         */
        jsonEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => actual is Expected
            >(),
        /**
         * Checks that two values are _not_ deeply equal when stringified into JSON. This may not
         * make any sense if the values are not valid JSON. This internally sorts all given object
         * keys so it is insensitive to object key order.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.notJsonEquals({a: 'a'}, {a: 'a'}); // false
         *
         * check.notJsonEquals({a: {b: 'b'}}, {a: {b: 'c'}}); // true
         * ```
         *
         * @see
         * - {@link check.jsonEquals} : the opposite check.
         * - {@link check.entriesEqual} : another deep equality check.
         * - {@link check.deepEquals} : the most thorough (but also slow) deep equality check.
         */
        notJsonEquals: autoGuardSymbol,
    },
    assertWrap: {
        /**
         * Asserts that two values are deeply equal when stringified into JSON. This will fail or
         * may not make any sense if the values are not valid JSON. This internally sorts all given
         * object keys so it is insensitive to object key order. Returns the first value if the
         * assertion passes.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.jsonEquals({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * assertWrap.jsonEquals({a: {b: 'b'}}, {a: {b: 'c'}}); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If both inputs are not equal.
         * @see
         * - {@link assertWrap.notJsonEquals} : the opposite assertion.
         * - {@link assertWrap.entriesEqual} : another deep equality assertion.
         * - {@link assertWrap.deepEquals} : the most thorough (but also slow) deep equality assertion.
         */
        jsonEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, Expected>
            >(),
        /**
         * Asserts that two values are _not_ deeply equal when stringified into JSON. This may not
         * make any sense if the values are not valid JSON. This internally sorts all given object
         * keys so it is insensitive to object key order. Returns the first value if the assertion
         * passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.notJsonEquals({a: 'a'}, {a: 'a'}); // throws an error
         *
         * assertWrap.notJsonEquals({a: {b: 'b'}}, {a: {b: 'c'}}); // returns `{a: {b: 'b'}}`
         * ```
         *
         * @throws {@link AssertionError} If both inputs are not equal.
         * @see
         * - {@link assertWrap.jsonEquals} : the opposite assertion.
         * - {@link assertWrap.entriesEqual} : another deep equality assertion.
         * - {@link assertWrap.deepEquals} : the most thorough (but also slow) deep equality assertion.
         */
        notJsonEquals: autoGuardSymbol,
    },
    checkWrap: {
        /**
         * Checks that two values are deeply equal when stringified into JSON. This will fail or may
         * not make any sense if the values are not valid JSON. This internally sorts all given
         * object keys so it is insensitive to object key order. Returns the first value if the
         * check passes.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.jsonEquals({a: 'a'}, {a: 'a'}); // returns `{a: 'a'}`
         *
         * checkWrap.jsonEquals({a: {b: 'b'}}, {a: {b: 'c'}}); // returns `undefined`
         * ```
         *
         * @see
         * - {@link checkWrap.notJsonEquals} : the opposite check.
         * - {@link checkWrap.entriesEqual} : another deep equality check.
         * - {@link checkWrap.deepEquals} : the most thorough (but also slow) deep equality check.
         */
        jsonEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    actual: Actual,
                    expected: Expected,
                ) => NarrowToExpected<Actual, Expected> | undefined
            >(),
        /**
         * Checks that two values are _not_ deeply equal when stringified into JSON. This may not
         * make any sense if the values are not valid JSON. This internally sorts all given object
         * keys so it is insensitive to object key order. Returns the first value if the check
         * passes.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.notJsonEquals({a: 'a'}, {a: 'a'}); // false
         *
         * checkWrap.notJsonEquals({a: {b: 'b'}}, {a: {b: 'c'}}); // true
         * ```
         *
         * @see
         * - {@link checkWrap.jsonEquals} : the opposite check.
         * - {@link checkWrap.entriesEqual} : another deep equality check.
         * - {@link checkWrap.deepEquals} : the most thorough (but also slow) deep equality check.
         */
        notJsonEquals: autoGuardSymbol,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is deeply equal to the first input when
         * stringified into JSON. This may not make any sense if the values are not valid JSON. This
         * internally sorts all given object keys so it is insensitive to object key order. Once the
         * callback output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the first value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.jsonEquals({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // returns `{a: 'a'}`
         *
         * await waitUntil.jsonEquals({a: {b: 'c'}}, () => {
         *     return {a: {b: 'b'}};
         * }); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.notJsonEquals} : the opposite assertion.
         * - {@link waitUntil.entriesEqual} : another deep equality assertion.
         * - {@link waitUntil.deepEquals} : the most thorough (but also slow) deep equality assertion.
         */
        jsonEquals:
            autoGuard<
                <Actual, Expected extends Actual>(
                    expected: Expected,
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Actual, Expected>>
            >(),
        /**
         * Repeatedly calls a callback until its output is _not_ deeply equal to the first input
         * when stringified into JSON. This may not make any sense if the values are not valid JSON.
         * This internally sorts all given object keys so it is insensitive to object key order.
         * Once the callback output passes, it is returned. If the attempts time out, an error is
         * thrown.
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.notJsonEquals({a: 'a'}, () => {
         *     return {a: 'a'};
         * }); // throws an error
         *
         * await waitUntil.notJsonEquals({a: {b: 'c'}}, () => {
         *     return {a: {b: 'b'}};
         * }); // returns `{a: {b: 'b'}}`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.jsonEquals} : the opposite assertion.
         * - {@link waitUntil.entriesEqual} : another not deep equality assertion.
         * - {@link waitUntil.deepEquals} : the most thorough (but also slow) not deep equality assertion.
         */
        notJsonEquals: autoGuardSymbol,
    },
} satisfies GuardGroup<typeof assertions>;
