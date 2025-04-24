import {
    type AnyFunction,
    type MaybePromise,
    type NarrowToActual,
    type NarrowToExpected,
    stringify,
    type UnknownObject,
} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import {type GuardGroup} from '../guard-types/guard-group.js';
import {createWaitUntil, type WaitUntilOptions} from '../guard-types/wait-until-function.js';

type ArrayNarrow<Actual> =
    NarrowToExpected<Actual, unknown[]> extends never
        ? NarrowToExpected<Actual, ReadonlyArray<unknown>> extends never
            ? unknown[] extends Actual
                ? unknown[]
                : never
            : NarrowToExpected<Actual, ReadonlyArray<unknown>>
        : NarrowToExpected<Actual, unknown[]>;

const assertions = {
    /**
     * Asserts that a value is an array.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isArray([]); // passes
     * assert.isArray({length: 4}); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotArray} : the opposite assertion.
     */
    isArray<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is ArrayNarrow<Actual> {
        if (!Array.isArray(actual)) {
            throw new AssertionError(`'${stringify(actual)}' is not an array.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is a BigInt.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isBigInt(123n); // passes
     * assert.isBigInt(123); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotBigInt} : the opposite assertion.
     */
    isBigInt(
        this: void,
        actual: unknown,
        failureMessage?: string | undefined,
    ): asserts actual is bigint {
        if (typeof actual !== 'bigint') {
            throw new AssertionError(`'${stringify(actual)}' is not a bigint.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is a boolean.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isBoolean(true); // passes
     * assert.isBoolean('true'); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotBoolean} : the opposite assertion.
     */
    isBoolean(
        this: void,
        actual: unknown,
        failureMessage?: string | undefined,
    ): asserts actual is boolean {
        if (typeof actual !== 'boolean') {
            throw new AssertionError(`'${stringify(actual)}' is not a boolean.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is a function.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isFunction(() => {}); // passes
     * assert.isFunction({}); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotFunction} : the opposite assertion.
     */
    isFunction<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is NarrowToActual<Actual, AnyFunction> {
        if (typeof actual !== 'function') {
            throw new AssertionError(`'${stringify(actual)}' is not a function.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is exactly `null`.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNull(null); // passes
     * assert.isNull(undefined); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotFunction} : the opposite assertion.
     */
    isNull(
        this: void,
        actual: unknown,
        failureMessage?: string | undefined,
    ): asserts actual is null {
        if (actual !== null) {
            throw new AssertionError(`'${stringify(actual)}' is not nul.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is a number. This excludes `NaN`.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNumber(123); // passes
     * assert.isNumber(123n); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotFunction} : the opposite assertion.
     */
    isNumber(
        this: void,
        actual: unknown,
        failureMessage?: string | undefined,
    ): asserts actual is number {
        if (typeof actual !== 'number' || isNaN(actual)) {
            throw new AssertionError(`'${stringify(actual)}' is not a number.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is an object. This excludes arrays.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isObject({}); // passes
     * assert.isObject([]); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotFunction} : the opposite assertion.
     */
    isObject(
        this: void,
        actual: unknown,
        failureMessage?: string | undefined,
    ): asserts actual is UnknownObject {
        if (Array.isArray(actual) || typeof actual !== 'object' || !actual) {
            throw new AssertionError(
                `'${stringify(actual)}' is not a non-null object.`,
                failureMessage,
            );
        }
    },
    /**
     * Asserts that a value is a string.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isString(''); // passes
     * assert.isString(5); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotFunction} : the opposite assertion.
     */
    isString(
        this: void,
        actual: unknown,
        failureMessage?: string | undefined,
    ): asserts actual is string {
        if (typeof actual !== 'string') {
            throw new AssertionError(`'${stringify(actual)}' is not a string.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is a symbol.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isSymbol(Symbol('my-symbol')); // passes
     * assert.isSymbol('my-symbol'); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotFunction} : the opposite assertion.
     */
    isSymbol(
        this: void,
        actual: unknown,
        failureMessage?: string | undefined,
    ): asserts actual is symbol {
        if (typeof actual !== 'symbol') {
            throw new AssertionError(`'${stringify(actual)}' is not a symbol.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is exactly `undefined`.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isUndefined(undefined); // passes
     * assert.isUndefined(null); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotFunction} : the opposite assertion.
     */
    isUndefined(
        this: void,
        actual: unknown,
        failureMessage?: string | undefined,
    ): asserts actual is undefined {
        if (typeof actual !== 'undefined') {
            throw new AssertionError(`'${stringify(actual)}' is not a undefined.`, failureMessage);
        }
    },

    /**
     * Asserts that a value is _not_ an array.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotArray([]); // fails
     * assert.isNotArray({length: 4}); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isArray} : the opposite assertion.
     */
    isNotArray<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, ReadonlyArray<unknown>> {
        if (Array.isArray(actual)) {
            throw new AssertionError(`'${stringify(actual)}' is an array.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ a BigInt.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotBigInt(123n); // fails
     * assert.isNotBigInt(123); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isBigInt} : the opposite assertion.
     */
    isNotBigInt<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, bigint> {
        if (typeof actual === 'bigint') {
            throw new AssertionError(`'${stringify(actual)}' is a bigint.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ a boolean.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotBoolean(true); // fails
     * assert.isNotBoolean('true'); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isBoolean} : the opposite assertion.
     */
    isNotBoolean<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, boolean> {
        if (typeof actual === 'boolean') {
            throw new AssertionError(`'${stringify(actual)}' is a boolean.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ a function.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotFunction(() => {}); // fails
     * assert.isNotFunction({}); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isFunction} : the opposite assertion.
     */
    isNotFunction<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, AnyFunction> {
        if (typeof actual === 'function') {
            throw new AssertionError(`'${stringify(actual)}' is a function.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ exactly `null`.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotNull(null); // fails
     * assert.isNotNull(undefined); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed. @see
     * @see
     * - {@link assert.isFunction} : the opposite assertion.
     */
    isNotNull<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, null> {
        if (actual === null) {
            throw new AssertionError(`'${stringify(actual)}' is a null.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ a number. This includes `NaN`.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotNumber(123); // fails
     * assert.isNotNumber(123n); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isNotFunction} : the opposite assertion.
     */
    isNotNumber<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, number> {
        if (typeof actual === 'number') {
            throw new AssertionError(`'${stringify(actual)}' is a number.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ an object. This includes arrays.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotObject({}); // fails
     * assert.isNotObject([]); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isFunction} : the opposite assertion.
     */
    isNotObject<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, UnknownObject> {
        if (!Array.isArray(actual) && typeof actual === 'object' && !!actual) {
            throw new AssertionError(
                `'${stringify(actual)}' is a non-null object.`,
                failureMessage,
            );
        }
    },
    /**
     * Asserts that a value is _not_ a string.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotString(''); // fails
     * assert.isNotString(5); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isFunction} : the opposite assertion.
     */
    isNotString<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, string> {
        if (typeof actual === 'string') {
            throw new AssertionError(`'${stringify(actual)}' is a string.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ a symbol.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotSymbol(Symbol('my-symbol')); // fails
     * assert.isNotSymbol('my-symbol'); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isFunction} : the opposite assertion.
     */
    isNotSymbol<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, symbol> {
        if (typeof actual === 'symbol') {
            throw new AssertionError(`'${stringify(actual)}' is a symbol.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ exactly `undefined`.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotUndefined(undefined); // fails
     * assert.isNotUndefined(null); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion failed.
     * @see
     * - {@link assert.isFunction} : the opposite assertion.
     */
    isNotUndefined<Actual>(
        this: void,
        actual: Actual,
        failureMessage?: string | undefined,
    ): asserts actual is Exclude<Actual, undefined> {
        if (typeof actual === 'undefined') {
            throw new AssertionError(`'${stringify(actual)}' is a undefined.`, failureMessage);
        }
    },
};

export const runtimeTypeGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a value is an array.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isArray([]); // returns `true`
         * check.isArray({length: 4}); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotArray} : the opposite check.
         */
        isArray<Actual>(this: void, actual: Actual): actual is ArrayNarrow<Actual> {
            return Array.isArray(actual);
        },
        /**
         * Checks that a value is a BigInt.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isBigInt(123n); // returns `true`
         * check.isBigInt(123); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotBigInt} : the opposite check.
         */
        isBigInt<Actual>(this: void, actual: Actual): actual is NarrowToActual<Actual, bigint> {
            return typeof actual === 'bigint';
        },
        /**
         * Checks that a value is a boolean.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isBoolean(true); // returns `true`
         * check.isBoolean('true'); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotBoolean} : the opposite check.
         */
        isBoolean<Actual>(this: void, actual: Actual): actual is NarrowToActual<Actual, boolean> {
            return typeof actual === 'boolean';
        },
        /**
         * Checks that a value is a function.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isFunction(() => {}); // returns `true`
         * check.isFunction({}); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotFunction} : the opposite check.
         */
        isFunction<Actual>(
            this: void,
            actual: Actual,
        ): actual is NarrowToActual<Actual, AnyFunction> {
            return typeof actual === 'function';
        },
        /**
         * Checks that a value is exactly `null`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNull(null); // returns `true`
         * check.isNull(undefined); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotFunction} : the opposite check.
         */
        isNull<Actual>(this: void, actual: Actual): actual is NarrowToActual<Actual, null> {
            return actual === null;
        },
        /**
         * Checks that a value is a number. This excludes `NaN`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNumber(123); // returns `true`
         * check.isNumber(123n); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotFunction} : the opposite check.
         */
        isNumber<Actual>(this: void, actual: Actual): actual is NarrowToActual<Actual, number> {
            return typeof actual === 'number';
        },
        /**
         * Checks that a value is an object. This excludes arrays.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isObject({}); // returns `true`
         * check.isObject([]); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotFunction} : the opposite check.
         */
        isObject<Actual>(
            this: void,
            actual: Actual,
        ): actual is NarrowToActual<Actual, UnknownObject> {
            return !Array.isArray(actual) && typeof actual === 'object' && !!actual;
        },
        /**
         * Checks that a value is a string.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isString(''); // returns `true`
         * check.isString(5); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotFunction} : the opposite check.
         */
        isString<Actual>(this: void, actual: Actual): actual is NarrowToActual<Actual, string> {
            return typeof actual === 'string';
        },
        /**
         * Checks that a value is a symbol.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isSymbol(Symbol('my-symbol')); // returns `true`
         * check.isSymbol('my-symbol'); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotFunction} : the opposite check.
         */
        isSymbol<Actual>(this: void, actual: Actual): actual is NarrowToActual<Actual, symbol> {
            return typeof actual === 'symbol';
        },
        /**
         * Checks that a value is exactly `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isUndefined(undefined); // returns `true`
         * check.isUndefined(null); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotFunction} : the opposite check.
         */
        isUndefined<Actual>(
            this: void,
            actual: Actual,
        ): actual is NarrowToActual<Actual, undefined> {
            return actual === undefined;
        },

        /**
         * Checks that a value is _not_ an array.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotArray([]); // returns `false`
         * check.isNotArray({length: 4}); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isArray} : the opposite check.
         */
        isNotArray<Actual>(
            this: void,
            actual: Actual,
        ): actual is Exclude<Actual, ReadonlyArray<unknown>> {
            return !Array.isArray(actual);
        },
        /**
         * Checks that a value is _not_ a BigInt.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotBigInt(123n); // returns `false`
         * check.isNotBigInt(123); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isBigInt} : the opposite check.
         */
        isNotBigInt<Actual>(this: void, actual: Actual): actual is Exclude<Actual, bigint> {
            return typeof actual !== 'bigint';
        },
        /**
         * Checks that a value is _not_ a boolean.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotBoolean(true); // returns `false`
         * check.isNotBoolean('true'); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isBoolean} : the opposite check.
         */
        isNotBoolean<Actual>(this: void, actual: Actual): actual is Exclude<Actual, boolean> {
            return typeof actual !== 'boolean';
        },
        /**
         * Checks that a value is _not_ a function.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotFunction(() => {}); // returns `false`
         * check.isNotFunction({}); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isFunction} : the opposite check.
         */
        isNotFunction<Actual>(this: void, actual: Actual): actual is Exclude<Actual, AnyFunction> {
            return typeof actual !== 'function';
        },
        /**
         * Checks that a value is _not_ exactly `null`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotNull(null); // returns `false`
         * check.isNotNull(undefined); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isFunction} : the opposite check.
         */
        isNotNull<Actual>(this: void, actual: Actual): actual is Exclude<Actual, null> {
            return actual !== null;
        },
        /**
         * Checks that a value is _not_ a number. This includes `NaN`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotNumber(123); // returns `false`
         * check.isNotNumber(123n); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isNotFunction} : the opposite check.
         */
        isNotNumber<Actual>(this: void, actual: Actual): actual is Exclude<Actual, number> {
            return typeof actual !== 'number';
        },
        /**
         * Checks that a value is _not_ an object. This includes arrays.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotObject({}); // returns `false`
         * check.isNotObject([]); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isFunction} : the opposite check.
         */
        isNotObject<Actual>(this: void, actual: Actual): actual is Exclude<Actual, UnknownObject> {
            return Array.isArray(actual) || typeof actual !== 'object' || !actual;
        },
        /**
         * Checks that a value is _not_ a string.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotString(''); // returns `false`
         * check.isNotString(5); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isFunction} : the opposite check.
         */
        isNotString<Actual>(this: void, actual: Actual): actual is Exclude<Actual, string> {
            return typeof actual !== 'string';
        },
        /**
         * Checks that a value is _not_ a symbol.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotSymbol(Symbol('my-symbol')); // returns `false`
         * check.isNotSymbol('my-symbol'); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isFunction} : the opposite check.
         */
        isNotSymbol<Actual>(this: void, actual: Actual): actual is Exclude<Actual, symbol> {
            return typeof actual !== 'symbol';
        },
        /**
         * Checks that a value is _not_ exactly `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotUndefined(undefined); // returns `false`
         * check.isNotUndefined(null); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isFunction} : the opposite check.
         */
        isNotUndefined<Actual>(this: void, actual: Actual): actual is Exclude<Actual, undefined> {
            return typeof actual !== 'undefined';
        },
    },
    assertWrap: {
        /**
         * Asserts that a value is an array. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isArray([]); // returns `[]`
         * assertWrap.isArray({length: 4}); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotArray} : the opposite assertion.
         */
        isArray<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): ArrayNarrow<Actual> {
            if (!Array.isArray(actual)) {
                throw new AssertionError(`'${stringify(actual)}' is not an array.`, failureMessage);
            }

            return actual as ArrayNarrow<Actual>;
        },
        /**
         * Asserts that a value is a BigInt. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isBigInt(123n); // returns `123n`
         * assertWrap.isBigInt(123); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotBigInt} : the opposite assertion.
         */
        isBigInt<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Actual, bigint> {
            if (typeof actual !== 'bigint') {
                throw new AssertionError(`'${stringify(actual)}' is not a bigint.`, failureMessage);
            }

            return actual as NarrowToExpected<Actual, bigint>;
        },
        /**
         * Asserts that a value is a boolean. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isBoolean(true); // returns `true`
         * assertWrap.isBoolean('true'); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotBoolean} : the opposite assertion.
         */
        isBoolean<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Actual, boolean> {
            if (typeof actual !== 'boolean') {
                throw new AssertionError(
                    `'${stringify(actual)}' is not a boolean.`,
                    failureMessage,
                );
            }

            return actual as NarrowToExpected<Actual, boolean>;
        },
        /**
         * Asserts that a value is a function. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isFunction(() => {}); // returns `() => {}`
         * assertWrap.isFunction({}); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotFunction} : the opposite assertion.
         */
        isFunction<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToActual<Actual, AnyFunction> {
            if (typeof actual !== 'function') {
                throw new AssertionError(
                    `'${stringify(actual)}' is not a function.`,
                    failureMessage,
                );
            }

            return actual as NarrowToActual<Actual, AnyFunction>;
        },
        /**
         * Asserts that a value is exactly `null. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNull(null); // returns `null`
         * assertWrap.isNull(undefined); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotFunction} : the opposite assertion.
         */
        isNull<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Actual, null> {
            if (actual !== null) {
                throw new AssertionError(`'${stringify(actual)}' is not nul.`, failureMessage);
            }

            return actual as NarrowToExpected<Actual, null>;
        },
        /**
         * Asserts that a value is a number. This excludes `NaN. Returns the value if the assertion
         * passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNumber(123); // returns `123`
         * assertWrap.isNumber(123n); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotFunction} : the opposite assertion.
         */
        isNumber<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Actual, number> {
            if (typeof actual !== 'number' || isNaN(actual)) {
                throw new AssertionError(`'${stringify(actual)}' is not a number.`, failureMessage);
            }

            return actual as NarrowToExpected<Actual, number>;
        },
        /**
         * Asserts that a value is an object. This excludes arrays. Returns the value if the
         * assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isObject({}); // returns `{}`
         * assertWrap.isObject([]); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotFunction} : the opposite assertion.
         */
        isObject<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Actual, UnknownObject> {
            if (Array.isArray(actual) || typeof actual !== 'object' || !actual) {
                throw new AssertionError(
                    `'${stringify(actual)}' is not a non-null object.`,
                    failureMessage,
                );
            }

            return actual as NarrowToExpected<Actual, UnknownObject>;
        },
        /**
         * Asserts that a value is a string. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isString(''); // returns `''`
         * assertWrap.isString(5); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotFunction} : the opposite assertion.
         */
        isString<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Actual, string> {
            if (typeof actual !== 'string') {
                throw new AssertionError(`'${stringify(actual)}' is not a string.`, failureMessage);
            }

            return actual as NarrowToExpected<Actual, string>;
        },
        /**
         * Trying to assign a unique symbol to another variable kills the `unique` part of the
         * symbol. this seems to be a bug with TypeScript itself.
         *
         * For some reason `checkWrap` does not suffer from this issue though.
         *
         * @example Const mySymbol = Symbol('mine'); const mySymbol2 = mySymbol; // this is no
         * longer `unique symbol`
         */
        /**
         * Asserts that a value is a symbol. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isSymbol(Symbol('my-symbol')); // returns the created symbol
         * assertWrap.isSymbol('my-symbol'); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotFunction} : the opposite assertion.
         */
        isSymbol<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Actual, symbol> {
            if (typeof actual !== 'symbol') {
                throw new AssertionError(`'${stringify(actual)}' is not a symbol.`, failureMessage);
            }

            return actual as NarrowToExpected<Actual, symbol>;
        },
        /**
         * Asserts that a value is exactly `undefined. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isUndefined(undefined); // returns `undefined`
         * assertWrap.isUndefined(null); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotFunction} : the opposite assertion.
         */
        isUndefined<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Actual, undefined> {
            if (typeof actual !== 'undefined') {
                throw new AssertionError(
                    `'${stringify(actual)}' is not a undefined.`,
                    failureMessage,
                );
            }

            return actual as NarrowToExpected<Actual, undefined>;
        },

        /**
         * Asserts that a value is _not_ an array. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotArray([]); // throws an error
         * assertWrap.isNotArray({length: 4}); // returns `{length: 4}`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isArray} : the opposite assertion.
         */
        isNotArray<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, ReadonlyArray<unknown>> {
            if (Array.isArray(actual)) {
                throw new AssertionError(`'${stringify(actual)}' is an array.`, failureMessage);
            }

            return actual as Exclude<Actual, ReadonlyArray<unknown>>;
        },
        /**
         * Asserts that a value is _not_ a BigInt. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotBigInt(123n); // throws an error
         * assertWrap.isNotBigInt(123); // returns `123`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isBigInt} : the opposite assertion.
         */
        isNotBigInt<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, bigint> {
            if (typeof actual === 'bigint') {
                throw new AssertionError(`'${stringify(actual)}' is a bigint.`, failureMessage);
            }
            return actual as Exclude<Actual, bigint>;
        },
        /**
         * Asserts that a value is _not_ a boolean. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotBoolean(true); // throws an error
         * assertWrap.isNotBoolean('true'); // returns `'true'`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isBoolean} : the opposite assertion.
         */
        isNotBoolean<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, boolean> {
            if (typeof actual === 'boolean') {
                throw new AssertionError(`'${stringify(actual)}' is a boolean.`, failureMessage);
            }

            return actual as Exclude<Actual, boolean>;
        },
        /**
         * Asserts that a value is _not_ a function. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotFunction(() => {}); // throws an error
         * assertWrap.isNotFunction({}); // returns `{}`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isFunction} : the opposite assertion.
         */
        isNotFunction<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, AnyFunction> {
            if (typeof actual === 'function') {
                throw new AssertionError(`'${stringify(actual)}' is a function.`, failureMessage);
            }

            return actual as Exclude<Actual, AnyFunction>;
        },
        /**
         * Asserts that a value is _not_ exactly `null. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotNull(null); // throws an error
         * assertWrap.isNotNull(undefined); // returns `undefined`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed. @see
         * @see
         * - {@link assertWrap.isFunction} : the opposite assertion.
         */
        isNotNull<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, null> {
            if (actual === null) {
                throw new AssertionError(`'${stringify(actual)}' is a null.`, failureMessage);
            }

            return actual as Exclude<Actual, null>;
        },
        /**
         * Asserts that a value is _not_ a number. This includes `NaN. Returns the value if the
         * assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotNumber(123); // throws an error
         * assertWrap.isNotNumber(123n); // returns `123n`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isNotFunction} : the opposite assertion.
         */
        isNotNumber<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, number> {
            if (typeof actual === 'number') {
                throw new AssertionError(`'${stringify(actual)}' is a number.`, failureMessage);
            }

            return actual as Exclude<Actual, number>;
        },
        /**
         * Asserts that a value is _not_ an object. This includes arrays. Returns the value if the
         * assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotObject({}); // throws an error
         * assertWrap.isNotObject([]); // returns `[]`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isFunction} : the opposite assertion.
         */
        isNotObject<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, UnknownObject> {
            if (!Array.isArray(actual) && typeof actual === 'object' && !!actual) {
                throw new AssertionError(
                    `'${stringify(actual)}' is a non-null object.`,
                    failureMessage,
                );
            }

            return actual as Exclude<Actual, UnknownObject>;
        },
        /**
         * Asserts that a value is _not_ a string. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotString(''); // throws an error
         * assertWrap.isNotString(5); // returns `5`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isFunction} : the opposite assertion.
         */
        isNotString<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, string> {
            if (typeof actual === 'string') {
                throw new AssertionError(`'${stringify(actual)}' is a string.`, failureMessage);
            }

            return actual as Exclude<Actual, string>;
        },
        /**
         * Asserts that a value is _not_ a symbol. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotSymbol(Symbol('my-symbol')); // throws an error
         * assertWrap.isNotSymbol('my-symbol'); // returns `'my-symbol'`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isFunction} : the opposite assertion.
         */
        isNotSymbol<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, symbol> {
            if (typeof actual === 'symbol') {
                throw new AssertionError(`'${stringify(actual)}' is a symbol.`, failureMessage);
            }

            return actual as Exclude<Actual, symbol>;
        },
        /**
         * Asserts that a value is _not_ exactly `undefined. Returns the value if the assertion
         * passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotUndefined(undefined); // throws an error
         * assertWrap.isNotUndefined(null); // returns `null`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link assertWrap.isFunction} : the opposite assertion.
         */
        isNotUndefined<Actual>(
            this: void,
            actual: Actual,
            failureMessage?: string | undefined,
        ): Exclude<Actual, undefined> {
            if (typeof actual === 'undefined') {
                throw new AssertionError(`'${stringify(actual)}' is a undefined.`, failureMessage);
            }

            return actual as Exclude<Actual, undefined>;
        },
    },
    checkWrap: {
        /**
         * Checks that a value is an array. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isArray([]); // returns `[]`
         * checkWrap.isArray({length: 4}); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotArray} : the opposite check.
         */
        isArray<Actual>(this: void, actual: Actual): ArrayNarrow<Actual> | undefined {
            if (Array.isArray(actual)) {
                return actual as ArrayNarrow<Actual>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is a BigInt. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isBigInt(123n); // returns `123n`
         * checkWrap.isBigInt(123); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotBigInt} : the opposite check.
         */
        isBigInt<Actual>(this: void, actual: Actual): NarrowToActual<Actual, bigint> | undefined {
            if (typeof actual === 'bigint') {
                return actual as NarrowToActual<Actual, bigint>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is a boolean. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isBoolean(true); // returns `true`
         * checkWrap.isBoolean('true'); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotBoolean} : the opposite check.
         */
        isBoolean<Actual>(this: void, actual: Actual): NarrowToActual<Actual, boolean> | undefined {
            if (typeof actual === 'boolean') {
                return actual as NarrowToActual<Actual, boolean>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is a function. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isFunction(() => {}); // returns `() => {}`
         * checkWrap.isFunction({}); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotFunction} : the opposite check.
         */
        isFunction<Actual>(
            this: void,
            actual: Actual,
        ): NarrowToActual<Actual, AnyFunction> | undefined {
            if (typeof actual === 'function') {
                return actual as NarrowToActual<Actual, AnyFunction>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is exactly `null. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNull(null); // returns `null`
         * checkWrap.isNull(undefined); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotFunction} : the opposite check.
         */
        isNull<Actual>(this: void, actual: Actual): NarrowToActual<Actual, null> | undefined {
            if (actual === null) {
                return actual as NarrowToActual<Actual, null>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is a number. This excludes `NaN. Returns the value if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNumber(123); // returns `123`
         * checkWrap.isNumber(123n); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotFunction} : the opposite check.
         */
        isNumber<Actual>(this: void, actual: Actual): NarrowToActual<Actual, number> | undefined {
            if (typeof actual === 'number') {
                return actual as NarrowToActual<Actual, number>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is an object. This excludes arrays. Returns the value if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isObject({}); // returns `{}`
         * checkWrap.isObject([]); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotFunction} : the opposite check.
         */
        isObject<Actual>(
            this: void,
            actual: Actual,
        ): NarrowToActual<Actual, UnknownObject> | undefined {
            if (!Array.isArray(actual) && typeof actual === 'object' && !!actual) {
                return actual as NarrowToActual<Actual, UnknownObject>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is a string. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isString(''); // returns `''`
         * checkWrap.isString(5); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotFunction} : the opposite check.
         */
        isString<Actual>(this: void, actual: Actual): NarrowToActual<Actual, string> | undefined {
            if (typeof actual === 'string') {
                return actual as NarrowToActual<Actual, string>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is a symbol. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isSymbol(Symbol('my-symbol')); // returns the created symbol
         * checkWrap.isSymbol('my-symbol'); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotFunction} : the opposite check.
         */
        isSymbol<Actual>(this: void, actual: Actual): NarrowToActual<Actual, symbol> | undefined {
            if (typeof actual === 'symbol') {
                return actual as NarrowToActual<Actual, symbol>;
            } else {
                return undefined;
            }
        },

        /**
         * Checks that a value is _not_ an array. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotArray([]); // returns `undefined`
         * checkWrap.isNotArray({length: 4}); // returns `{length: 4}`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isArray} : the opposite check.
         */
        isNotArray<Actual>(
            this: void,
            actual: Actual,
        ): Exclude<Actual, ReadonlyArray<unknown>> | undefined {
            if (Array.isArray(actual)) {
                return undefined;
            } else {
                return actual as Exclude<Actual, ReadonlyArray<unknown>>;
            }
        },
        /**
         * Checks that a value is _not_ a BigInt. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotBigInt(123n); // returns `undefined`
         * checkWrap.isNotBigInt(123); // returns `123`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isBigInt} : the opposite check.
         */
        isNotBigInt<Actual>(this: void, actual: Actual): Exclude<Actual, bigint> | undefined {
            if (typeof actual === 'bigint') {
                return undefined;
            } else {
                return actual as Exclude<Actual, bigint>;
            }
        },
        /**
         * Checks that a value is _not_ a boolean. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotBoolean(true); // returns `undefined`
         * checkWrap.isNotBoolean('true'); // returns `'true'`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isBoolean} : the opposite check.
         */
        isNotBoolean<Actual>(this: void, actual: Actual): Exclude<Actual, boolean> | undefined {
            if (typeof actual === 'boolean') {
                return undefined;
            } else {
                return actual as Exclude<Actual, boolean>;
            }
        },
        /**
         * Checks that a value is _not_ a function. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotFunction(() => {}); // returns `undefined`
         * checkWrap.isNotFunction({}); // returns `{}`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isFunction} : the opposite check.
         */
        isNotFunction<Actual>(
            this: void,
            actual: Actual,
        ): Exclude<Actual, AnyFunction> | undefined {
            if (typeof actual === 'function') {
                return undefined;
            } else {
                return actual as Exclude<Actual, AnyFunction>;
            }
        },
        /**
         * Checks that a value is _not_ exactly `null. Returns the value if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotNull(null); // returns `undefined`
         * checkWrap.isNotNull(undefined); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isFunction} : the opposite check.
         */
        isNotNull<Actual>(this: void, actual: Actual): Exclude<Actual, null> | undefined {
            if (actual === null) {
                return undefined;
            } else {
                return actual as Exclude<Actual, null>;
            }
        },
        /**
         * Checks that a value is _not_ a number. This includes `NaN. Returns the value if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotNumber(123); // returns `undefined`
         * checkWrap.isNotNumber(123n); // returns `123n`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotFunction} : the opposite check.
         */
        isNotNumber<Actual>(this: void, actual: Actual): Exclude<Actual, number> | undefined {
            if (typeof actual === 'number') {
                return undefined;
            } else {
                return actual as Exclude<Actual, number>;
            }
        },
        /**
         * Checks that a value is _not_ an object. This includes arrays. Returns the value if the
         * check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotObject({}); // returns `undefined`
         * checkWrap.isNotObject([]); // returns `[]`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isFunction} : the opposite check.
         */
        isNotObject<Actual>(
            this: void,
            actual: Actual,
        ): Exclude<Actual, UnknownObject> | undefined {
            if (Array.isArray(actual) || typeof actual !== 'object' || !actual) {
                return actual as Exclude<Actual, UnknownObject>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a value is _not_ a string. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotString(''); // returns `undefined`
         * checkWrap.isNotString(5); // returns `5`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isFunction} : the opposite check.
         */
        isNotString<Actual>(this: void, actual: Actual): Exclude<Actual, string> | undefined {
            if (typeof actual === 'string') {
                return undefined;
            } else {
                return actual as Exclude<Actual, string>;
            }
        },
        /**
         * Checks that a value is _not_ a symbol. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotSymbol(Symbol('my-symbol')); // returns `undefined`
         * checkWrap.checkWrap('my-symbol'); // returns `'my-symbol'`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isFunction} : the opposite check.
         */
        isNotSymbol<Actual>(this: void, actual: Actual): Exclude<Actual, symbol> | undefined {
            if (typeof actual === 'symbol') {
                return undefined;
            } else {
                return actual as Exclude<Actual, symbol>;
            }
        },
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is an array. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isArray(() => []); // passes
         * await waitUntil.isArray(() => {
         *     return {length: 4};
         * }); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotArray} : the opposite assertion.
         */
        isArray: createWaitUntil(assertions.isArray) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<ArrayNarrow<Actual>>,
        /**
         * Repeatedly calls a callback until its output is a BigInt. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isBigInt(() => 123n); // returns `123n`
         * await waitUntil.isBigInt(() => 123); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotBigInt} : the opposite assertion.
         */
        isBigInt: createWaitUntil(assertions.isBigInt) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Actual, bigint>>,
        /**
         * Repeatedly calls a callback until its output is a boolean. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isBoolean(() => true); // returns `true`
         * await waitUntil.isBoolean(() => 'true'); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotBoolean} : the opposite assertion.
         */
        isBoolean: createWaitUntil(assertions.isBoolean) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Actual, boolean>>,
        /**
         * Repeatedly calls a callback until its output is a function. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isFunction(() => () => {
         *     return {};
         * }); // returns `{}`
         * await waitUntil.isFunction(() => {
         *     return {};
         * }); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotFunction} : the opposite assertion.
         */
        isFunction: createWaitUntil(assertions.isFunction) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToActual<Actual, AnyFunction>>,
        /**
         * Repeatedly calls a callback until its output is exactly `null`. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNull(() => null); // returns `null`
         * await waitUntil.isNull(() => undefined); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotFunction} : the opposite assertion.
         */
        isNull: createWaitUntil(assertions.isNull) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Actual, null>>,
        /**
         * Repeatedly calls a callback until its output is a number. This excludes `NaN`. Once the
         * callback output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNumber(() => 123); // returns `123`
         * await waitUntil.isNumber(() => 123n); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotFunction} : the opposite assertion.
         */
        isNumber: createWaitUntil(assertions.isNumber) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Actual, number>>,
        /**
         * Repeatedly calls a callback until its output is an object. This excludes arrays. Once the
         * callback output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isObject(() => {
         *     return {};
         * }); // returns `{}`
         * await waitUntil.isObject(() => []); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotFunction} : the opposite assertion.
         */
        isObject: createWaitUntil(assertions.isObject) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Actual, UnknownObject>>,
        /**
         * Repeatedly calls a callback until its output is a string. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isString(() => ''); // returns `''`
         * await waitUntil.isString(() => 5); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotFunction} : the opposite assertion.
         */
        isString: createWaitUntil(assertions.isString) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Actual, string>>,
        /**
         * Repeatedly calls a callback until its output is a symbol. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isSymbol(() => Symbol('my-symbol')); // returns the created symbol
         * await waitUntil.isSymbol(() => 'my-symbol'); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotFunction} : the opposite assertion.
         */
        isSymbol: createWaitUntil(assertions.isSymbol) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Actual, symbol>>,
        /**
         * Repeatedly calls a callback until its output is exactly `undefined`. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isUndefined(() => undefined); // returns `undefined`
         * await waitUntil.isUndefined(() => null); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotFunction} : the opposite assertion.
         */
        isUndefined: createWaitUntil(assertions.isUndefined) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Actual, undefined>>,

        /**
         * Repeatedly calls a callback until its output is _not_ an array. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotArray(() => []); // throws an error
         * await waitUntil.isNotArray(() => {
         *     return {length: 4};
         * }); // returns `{length: 4}`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isArray} : the opposite assertion.
         */
        isNotArray: createWaitUntil(assertions.isNotArray) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, ReadonlyArray<unknown>>>,
        /**
         * Repeatedly calls a callback until its output is _not_ a BigInt. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotBigInt(() => 123n); // throws an error
         * await waitUntil.isNotBigInt(() => 123); // returns `123`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isBigInt} : the opposite assertion.
         */
        isNotBigInt: createWaitUntil(assertions.isNotBigInt) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, bigint>>,
        /**
         * Repeatedly calls a callback until its output is _not_ a boolean. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotBoolean(() => true); // throws an error
         * await waitUntil.isNotBoolean(() => 'true'); // returns `'true'`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isBoolean} : the opposite assertion.
         */
        isNotBoolean: createWaitUntil(assertions.isNotBoolean) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, boolean>>,
        /**
         * Repeatedly calls a callback until its output is _not_ a function. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotFunction(() => () => {
         *     return {};
         * }); // throws an error
         * await waitUntil.isNotFunction(() => {
         *     return {};
         * }); // returns `{}`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isFunction} : the opposite assertion.
         */
        isNotFunction: createWaitUntil(assertions.isNotFunction) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, AnyFunction>>,
        /**
         * Repeatedly calls a callback until its output is _not_ exactly `null`. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotNull(() => null); // throws an error
         * await waitUntil.isNotNull(() => undefined); // returns `undefined`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed. @see
         * @see
         * - {@link waitUntil.isFunction} : the opposite assertion.
         */
        isNotNull: createWaitUntil(assertions.isNotNull) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, null>>,
        /**
         * Repeatedly calls a callback until its output is _not_ a number. This includes `NaN`. Once
         * the callback output passes, it is returned. If the attempts time out, an error is
         * thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotNumber(() => 123); // throws an error
         * await waitUntil.isNotNumber(() => 123n); // returns `123n`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isNotFunction} : the opposite assertion.
         */
        isNotNumber: createWaitUntil(assertions.isNotNumber) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, number>>,
        /**
         * Repeatedly calls a callback until its output is _not_ an object. This includes arrays.
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
         * await waitUntil.isNotObject(() => {
         *     return {};
         * }); // throws an error
         * await waitUntil.isNotObject(() => []); // returns `[]`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isFunction} : the opposite assertion.
         */
        isNotObject: createWaitUntil(assertions.isNotObject) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, UnknownObject>>,
        /**
         * Repeatedly calls a callback until its output is _not_ a string. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotString(() => ''); // throws an error
         * await waitUntil.isNotString(() => 5); // returns `5`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isFunction} : the opposite assertion.
         */
        isNotString: createWaitUntil(assertions.isNotString) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, string>>,
        /**
         * Repeatedly calls a callback until its output is _not_ a symbol. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotSymbol(() => Symbol('my-symbol')); // throws an error
         * await waitUntil.isNotSymbol(() => 'my-symbol'); // returns `'my-symbol'`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isFunction} : the opposite assertion.
         */
        isNotSymbol: createWaitUntil(assertions.isNotSymbol) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, symbol>>,
        /**
         * Repeatedly calls a callback until its output is _not_ exactly `undefined`. Once the
         * callback output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNotUndefined(() => undefined); // throws an error
         * await waitUntil.isNotUndefined(() => null); // returns `null`
         * ```
         *
         * @throws {@link AssertionError} If the assertion failed.
         * @see
         * - {@link waitUntil.isFunction} : the opposite assertion.
         */
        isNotUndefined: createWaitUntil(assertions.isNotUndefined) as <Actual>(
            this: void,
            callback: () => MaybePromise<Actual>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Actual, undefined>>,
    },
} satisfies GuardGroup<typeof assertions>;
