import {stringify, type MaybePromise} from '@augment-vir/core';
import {type Primitive} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard, autoGuardSymbol} from '../guard-types/guard-override.js';
import {type WaitUntilOptions} from '../guard-types/wait-until-function.js';

export type {Primitive} from 'type-fest';

/** Asserts that the given value is a primitive. */
function isPrimitive(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is Primitive {
    /**
     * `null` is a primitive but `typeof null` gives `'object'` so we have to special case `null`
     * here.
     */
    if (input !== null && (typeof input === 'object' || typeof input === 'function')) {
        throw new AssertionError(`'${stringify(input)}' is not a Primitive.`, failureMessage);
    }
}
function isNotPrimitive<const Actual>(
    input: Actual,
    failureMessage?: string | undefined,
): asserts input is Exclude<Actual, Primitive> {
    try {
        isPrimitive(input);
    } catch {
        return;
    }

    throw new AssertionError(`'${stringify(input)}' is a Primitive.`, failureMessage);
}

/** Asserts that the given value is a PropertyKey ( string | number | symbol). */
function isPropertyKey(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is PropertyKey {
    if (typeof input !== 'string' && typeof input !== 'number' && typeof input !== 'symbol') {
        throw new AssertionError(`'${stringify(input)}' is not a PropertyKey.`, failureMessage);
    }
}
function isNotPropertyKey<const Actual>(
    input: Actual,
    failureMessage?: string | undefined,
): asserts input is Exclude<Actual, PropertyKey> {
    try {
        isPropertyKey(input);
    } catch {
        return;
    }

    throw new AssertionError(`'${stringify(input)}' is a PropertyKey.`, failureMessage);
}

const assertions: {
    /**
     * Asserts that a value is a valid `PropertyKey`. `PropertyKey` is a built-in TypeScript type
     * which refers to all possible key types for a JavaScript object.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isPropertyKey('key'); // passes
     * assert.isPropertyKey(true); // fails
     * assert.isPropertyKey({}); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNotPropertyKey} : the opposite assertion.
     */
    isPropertyKey: typeof isPropertyKey;
    /**
     * Asserts that a value is _not_ a valid `PropertyKey`. `PropertyKey` is a built-in TypeScript
     * type which refers to all possible key types for a JavaScript object.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotPropertyKey('key'); // fails
     * assert.isNotPropertyKey(true); // passes
     * assert.isNotPropertyKey({}); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isPropertyKey} : the opposite assertion.
     */
    isNotPropertyKey: typeof isNotPropertyKey;

    /**
     * Asserts that a value is a JavaScript
     * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive).
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isPrimitive('key'); // passes
     * assert.isPrimitive(true); // passes
     * assert.isPrimitive({}); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNotPrimitive} : the opposite assertion.
     */
    isPrimitive: typeof isPrimitive;
    /**
     * Asserts that a value is _not_ a JavaScript
     * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive).
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isPrimitive('key'); // fails
     * assert.isPrimitive(true); // fails
     * assert.isPrimitive({}); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isPrimitive} : the opposite assertion.
     */
    isNotPrimitive: typeof isNotPrimitive;
} = {
    isPropertyKey,
    isNotPropertyKey,
    isPrimitive,
    isNotPrimitive,
};

export const primitiveGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a value is a valid `PropertyKey`. `PropertyKey` is a built-in TypeScript type
         * which refers to all possible key types for a JavaScript object.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isPropertyKey('key'); // returns `true`
         * check.isPropertyKey(true); // returns `false`
         * check.isPropertyKey({}); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotPropertyKey} : the opposite check.
         */
        isNotPrimitive:
            autoGuard<<const Actual>(input: Actual) => input is Exclude<Actual, Primitive>>(),
        /**
         * Checks that a value is _not_ a valid `PropertyKey`. `PropertyKey` is a built-in
         * TypeScript type which refers to all possible key types for a JavaScript object.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotPropertyKey('key'); // returns `false`
         * check.isNotPropertyKey(true); // returns `true`
         * check.isNotPropertyKey({}); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isPropertyKey} : the opposite check.
         */
        isNotPropertyKey:
            autoGuard<<const Actual>(input: Actual) => input is Exclude<Actual, PropertyKey>>(),
        /**
         * Checks that a value is a JavaScript
         * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive).
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isPrimitive('key'); // returns `true`
         * check.isPrimitive(true); // returns `true`
         * check.isPrimitive({}); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotPrimitive} : the opposite check.
         */
        isPrimitive: autoGuardSymbol,

        /**
         * Checks that a value is _not_ a JavaScript
         * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive).
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isPrimitive('key'); // returns `false`
         * check.isPrimitive(true); // returns `false`
         * check.isPrimitive({}); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isPrimitive} : the opposite check.
         */
        isPropertyKey: autoGuardSymbol,
    },
    assertWrap: {
        /**
         * Asserts that a value is a valid `PropertyKey`. `PropertyKey` is a built-in TypeScript
         * type which refers to all possible key types for a JavaScript object. Returns the value if
         * the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isPropertyKey('key'); // returns `'key'`
         * assertWrap.isPropertyKey(true); // throws an error
         * assertWrap.isPropertyKey({}); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNotPropertyKey} : the opposite assertion.
         */
        isNotPrimitive:
            autoGuard<
                <const Actual>(
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, Primitive>
            >(),
        /**
         * Asserts that a value is _not_ a valid `PropertyKey`. `PropertyKey` is a built-in
         * TypeScript type which refers to all possible key types for a JavaScript object. Returns
         * the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotPropertyKey('key'); // throws an error
         * assertWrap.isNotPropertyKey(true); // returns `true`
         * assertWrap.isNotPropertyKey({}); // returns `{}`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isPropertyKey} : the opposite assertion.
         */
        isNotPropertyKey:
            autoGuard<
                <const Actual>(
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, PropertyKey>
            >(),
        /**
         * Asserts that a value is a JavaScript
         * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive). Returns the value if
         * the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isPrimitive('key'); // returns `'key'`
         * assertWrap.isPrimitive(true); // returns `true`
         * assertWrap.isPrimitive({}); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNotPrimitive} : the opposite assertion.
         */
        isPrimitive: autoGuardSymbol,
        /**
         * Asserts that a value is _not_ a JavaScript
         * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive). Returns the value if
         * the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isPrimitive('key'); // throws an error
         * assertWrap.isPrimitive(true); // throws an error
         * assertWrap.isPrimitive({}); // returns `{}`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isPrimitive} : the opposite assertion.
         */
        isPropertyKey: autoGuardSymbol,
    },
    checkWrap: {
        /**
         * Checks that a value is a valid `PropertyKey`. `PropertyKey` is a built-in TypeScript type
         * which refers to all possible key types for a JavaScript object. Returns the value if the
         * check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isPropertyKey('key'); // returns `'key'`
         * checkWrap.isPropertyKey(true); // returns `undefined`
         * checkWrap.isPropertyKey({}); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNotPropertyKey} : the opposite check.
         */
        isNotPrimitive:
            autoGuard<<const Actual>(input: Actual) => Exclude<Actual, Primitive> | undefined>(),
        /**
         * Checks that a value is _not_ a valid `PropertyKey`. `PropertyKey` is a built-in
         * TypeScript type which refers to all possible key types for a JavaScript object. Returns
         * the value if the check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotPropertyKey('key'); // returns `undefined`
         * checkWrap.isNotPropertyKey(true); // returns `true`
         * checkWrap.isNotPropertyKey({}); // returns `{}`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isPropertyKey} : the opposite check.
         */
        isNotPropertyKey:
            autoGuard<<const Actual>(input: Actual) => Exclude<Actual, PropertyKey> | undefined>(),
        /**
         * Checks that a value is a JavaScript
         * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive). Returns the value if
         * the check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isPrimitive('key'); // returns `'key'`
         * checkWrap.isPrimitive(true); // returns `true`
         * checkWrap.isPrimitive({}); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNotPrimitive} : the opposite check.
         */
        isPrimitive: autoGuardSymbol,
        /**
         * Checks that a value is _not_ a JavaScript
         * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive). Returns the value if
         * the check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isPrimitive('key'); // returns `undefined`
         * checkWrap.isPrimitive(true); // returns `undefined`
         * checkWrap.isPrimitive({}); // returns `{}`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isPrimitive} : the opposite check.
         */
        isPropertyKey: autoGuardSymbol,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is a valid `PropertyKey`. `PropertyKey` is a
         * built-in TypeScript type which refers to all possible key types for a JavaScript object.
         * Once the callback output passes, it is returned. If the attempts time out, an error is
         * thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isPropertyKey('key'); // returns `'key'`
         * await waitUntil.isPropertyKey(true); // throws an error
         * await waitUntil.isPropertyKey({}); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isNotPropertyKey} : the opposite assertion.
         */
        isNotPrimitive:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, Primitive>>
            >(),
        /**
         * Repeatedly calls a callback until its output is _not_ a valid `PropertyKey`.
         * `PropertyKey` is a built-in TypeScript type which refers to all possible key types for a
         * JavaScript object. Once the callback output passes, it is returned. If the attempts time
         * out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotPropertyKey('key'); // throws an error
         * await waitUntil.isNotPropertyKey(true); // returns `true`
         * await waitUntil.isNotPropertyKey({}); // returns `{}`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isPropertyKey} : the opposite assertion.
         */
        isNotPropertyKey:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, PropertyKey>>
            >(),
        /**
         * Repeatedly calls a callback until its output is a JavaScript
         * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive). Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isPrimitive('key'); // returns `'key'`
         * await waitUntil.isPrimitive(true); // returns `true`
         * await waitUntil.isPrimitive({}); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isNotPrimitive} : the opposite assertion.
         */
        isPrimitive: autoGuardSymbol,
        /**
         * Repeatedly calls a callback until its output is _not_ a JavaScript
         * [primitive](https://developer.mozilla.org/docs/Glossary/Primitive). Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isPrimitive('key'); // throws an error
         * await waitUntil.isPrimitive(true); // throws an error
         * await waitUntil.isPrimitive({}); // returns `{}`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isPrimitive} : the opposite assertion.
         */
        isPropertyKey: autoGuardSymbol,
    },
} satisfies GuardGroup<typeof assertions>;
