import {
    AnyFunction,
    MaybePromise,
    NarrowToActual,
    NarrowToExpected,
    stringify,
    UnknownObject,
} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard, autoGuardSymbol} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

function isNotArray<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, ReadonlyArray<unknown>> {
    assertNotRuntimeType(actual, 'array', failureMessage);
}
function isNotBigInt<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, bigint> {
    assertNotRuntimeType(actual, 'bigint', failureMessage);
}
function isNotBoolean<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, boolean> {
    assertNotRuntimeType(actual, 'boolean', failureMessage);
}
function isNotFunction<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, AnyFunction> {
    assertNotRuntimeType(actual, 'function', failureMessage);
}
function isNotNumber<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, number> {
    assertNotRuntimeType(actual, 'number', failureMessage);
}
function isNotObject<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, UnknownObject> {
    assertNotRuntimeType(actual, 'object', failureMessage);
}
function isNotString<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, string> {
    assertNotRuntimeType(actual, 'string', failureMessage);
}
function isNotSymbol<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, symbol> {
    assertNotRuntimeType(actual, 'symbol', failureMessage);
}
function isNotUndefined<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, undefined> {
    assertNotRuntimeType(actual, 'undefined', failureMessage);
}
function isNotNull<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is Exclude<Actual, null> {
    assertNotRuntimeType(actual, 'null', failureMessage);
}

function isArray(
    actual: unknown,
    failureMessage?: string | undefined,
): asserts actual is unknown[] {
    assertRuntimeType(actual, 'array', failureMessage);
}
function isBigInt(actual: unknown, failureMessage?: string | undefined): asserts actual is bigint {
    assertRuntimeType(actual, 'bigint', failureMessage);
}
function isBoolean(
    actual: unknown,
    failureMessage?: string | undefined,
): asserts actual is boolean {
    assertRuntimeType(actual, 'boolean', failureMessage);
}
function isFunction<const Actual>(
    actual: Actual,
    failureMessage?: string | undefined,
): asserts actual is NarrowToActual<Actual, AnyFunction> {
    assertRuntimeType(actual, 'function', failureMessage);
}
function isNumber(actual: unknown, failureMessage?: string | undefined): asserts actual is number {
    assertRuntimeType(actual, 'number', failureMessage);
    if (isNaN(actual as number)) {
        throw new AssertionError('Value is NaN.', failureMessage);
    }
}
function isObject(
    actual: unknown,
    failureMessage?: string | undefined,
): asserts actual is UnknownObject {
    assertRuntimeType(actual, 'object', failureMessage);
}
function isString(actual: unknown, failureMessage?: string | undefined): asserts actual is string {
    assertRuntimeType(actual, 'string', failureMessage);
}
function isSymbol(actual: unknown, failureMessage?: string | undefined): asserts actual is symbol {
    assertRuntimeType(actual, 'symbol', failureMessage);
}
function isUndefined(
    actual: unknown,
    failureMessage?: string | undefined,
): asserts actual is undefined {
    assertRuntimeType(actual, 'undefined', failureMessage);
}
function isNull(actual: unknown, failureMessage?: string | undefined): asserts actual is null {
    assertRuntimeType(actual, 'null', failureMessage);
}

const assertions: {
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
    isArray: typeof isArray;
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
    isBigInt: typeof isBigInt;
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
    isBoolean: typeof isBoolean;
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
    isFunction: typeof isFunction;
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
    isNull: typeof isNull;
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
    isNumber: typeof isNumber;
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
    isObject: typeof isObject;
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
    isString: typeof isString;
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
    isSymbol: typeof isSymbol;
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
    isUndefined: typeof isUndefined;

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
    isNotArray: typeof isNotArray;
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
    isNotBigInt: typeof isNotBigInt;
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
    isNotBoolean: typeof isNotBoolean;
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
    isNotFunction: typeof isNotFunction;
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
    isNotNull: typeof isNotNull;
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
    isNotNumber: typeof isNotNumber;
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
    isNotObject: typeof isNotObject;
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
    isNotString: typeof isNotString;
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
    isNotSymbol: typeof isNotSymbol;
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
    isNotUndefined: typeof isNotUndefined;
} = {
    isArray,
    isBigInt,
    isBoolean,
    isFunction,
    isNull,
    isNumber,
    isObject,
    isString,
    isSymbol,
    isUndefined,

    isNotArray,
    isNotBigInt,
    isNotBoolean,
    isNotFunction,
    isNotNull,
    isNotNumber,
    isNotObject,
    isNotString,
    isNotSymbol,
    isNotUndefined,
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
        isArray: autoGuardSymbol,
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
        isBigInt: autoGuardSymbol,
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
        isBoolean: autoGuardSymbol,
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
        isFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is NarrowToActual<Actual, AnyFunction>
            >(),
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
        isNull: autoGuardSymbol,
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
        isNumber: autoGuardSymbol,
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
        isObject: autoGuardSymbol,
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
        isString: autoGuardSymbol,
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
        isSymbol: autoGuardSymbol,
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
        isUndefined: autoGuardSymbol,

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
        isNotArray:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, ReadonlyArray<unknown>>
            >(),
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
        isNotBigInt:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, bigint>
            >(),
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
        isNotBoolean:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, boolean>
            >(),
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
        isNotFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, AnyFunction>
            >(),
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
        isNotNull:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, null>
            >(),
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
        isNotNumber:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, number>
            >(),
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
        isNotObject:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, UnknownObject>
            >(),
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
        isNotString:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, string>
            >(),
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
        isNotSymbol:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, symbol>
            >(),
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
        isNotUndefined:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, undefined>
            >(),
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
        isArray: autoGuardSymbol,
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
        isBigInt: autoGuardSymbol,
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
        isBoolean: autoGuardSymbol,
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
        isFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => NarrowToActual<Actual, AnyFunction>
            >(),
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
        isNull: autoGuardSymbol,
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
        isNumber: autoGuardSymbol,
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
        isObject: autoGuardSymbol,
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
        isString: autoGuardSymbol,
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
        isSymbol:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, symbol>
            >(),
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
        isUndefined: autoGuardSymbol,

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
        isNotArray:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, ReadonlyArray<unknown>>
            >(),
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
        isNotBigInt:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, bigint>
            >(),
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
        isNotBoolean:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, boolean>
            >(),
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
        isNotFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, AnyFunction>
            >(),
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
        isNotNull:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, null>
            >(),
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
        isNotNumber:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, number>
            >(),
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
        isNotObject:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, UnknownObject>
            >(),
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
        isNotString:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, string>
            >(),
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
        isNotSymbol:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, symbol>
            >(),
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
        isNotUndefined:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, undefined>
            >(),
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
        isArray: autoGuardSymbol,
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
        isBigInt: autoGuardSymbol,
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
        isBoolean: autoGuardSymbol,
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
        isFunction:
            autoGuard<
                <const Actual>(actual: Actual) => NarrowToActual<Actual, AnyFunction> | undefined
            >(),
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
        isNull: autoGuardSymbol,
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
        isNumber: autoGuardSymbol,
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
        isObject: autoGuardSymbol,
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
        isString: autoGuardSymbol,
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
        isSymbol: autoGuardSymbol,
        /**
         * It doesn't make any sense for `checkWrap.isUndefined` to exist. If the input is
         * `undefined`, it returns `undefined`. If the input isn't `undefined`, it still returns
         * `undefined`.
         */
        /**
         * Checks that a value is exactly `undefined. Returns the value if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isUndefined(undefined); // returns `undefined`
         * checkWrap.isUndefined(null); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes. Otherwise, `undefined`.
         * @see
         * - {@link checkWrap.isNotFunction} : the opposite check.
         */
        isUndefined: undefined,

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
        isNotArray:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, ReadonlyArray<unknown>> | undefined
            >(),
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
        isNotBigInt:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, bigint> | undefined
            >(),
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
        isNotBoolean:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, boolean> | undefined
            >(),
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
        isNotFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, AnyFunction> | undefined
            >(),
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
        isNotNull:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, null> | undefined
            >(),
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
        isNotNumber:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, number> | undefined
            >(),
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
        isNotObject:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, UnknownObject> | undefined
            >(),
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
        isNotString:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, string> | undefined
            >(),
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
        isNotSymbol:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, symbol> | undefined
            >(),
        /**
         * It doesn't make any sense for `checkWrap.isNotUndefined` to exist. If the input is not
         * `undefined`, then it still returns `undefined`.
         */
        isNotUndefined: undefined,
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
        isArray: autoGuardSymbol,
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
        isBigInt: autoGuardSymbol,
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
        isBoolean: autoGuardSymbol,
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
        isFunction:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToActual<Actual, AnyFunction>>
            >(),
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
        isNull: autoGuardSymbol,
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
        isNumber: autoGuardSymbol,
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
        isObject: autoGuardSymbol,
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
        isString: autoGuardSymbol,
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
        isSymbol: autoGuardSymbol,
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
        isUndefined: autoGuardSymbol,

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
        isNotArray:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, ReadonlyArray<unknown>>>
            >(),
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
        isNotBigInt:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, bigint>>
            >(),
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
        isNotBoolean:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, boolean>>
            >(),
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
        isNotFunction:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, AnyFunction>>
            >(),
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
        isNotNull:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, null>>
            >(),
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
        isNotNumber:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, number>>
            >(),
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
        isNotObject:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, UnknownObject>>
            >(),
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
        isNotString:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, string>>
            >(),
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
        isNotSymbol:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, symbol>>
            >(),
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
        isNotUndefined:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, undefined>>
            >(),
    },
} satisfies GuardGroup<typeof assertions>;

/**
 * An enum representing the possible values returned by {@link getRuntimeType}. These values are
 * similar to the output of the built-in
 * [`typeof`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof) operator
 * except that this includes new types `array` and `null`, that `typeof` does not have, which are
 * both distinct from `object`.
 *
 * @category Assert : Util
 * @package @augment-vir/assert
 */
export enum RuntimeType {
    String = 'string',
    Number = 'number',
    Bigint = 'bigint',
    Boolean = 'boolean',
    Symbol = 'symbol',
    Undefined = 'undefined',
    Object = 'object',
    Function = 'function',
    /**
     * This is not included in {@link RuntimeType.Object}. (Compared to
     * [`typeof`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof)
     * which _does_ include `null` in the `'object'` type.)
     */
    Array = 'array',
    /**
     * This is not included in {@link RuntimeType.Object}. (Compared to
     * [`typeof`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof)
     * which _does_ include `null` in the `'object'` type.)
     */
    Null = 'null',
}

/**
 * Determines the {@link RuntimeType} of a variable. This is similar to the built-in
 * [`typeof`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof) operator
 * except in the following ways:
 *
 * - This returns an enum value ({@link RuntimeType}) rather than just a string (though the enum values
 *   are strings anyway).
 * - This includes new types `array` and `null`, that `typeof` does not have, which are both distinct
 *   from `object`.
 *
 * @category Assert : Util
 * @example
 *
 * ```ts
 * import {getRuntimeType} from '@augment-vir/assert';
 *
 * getRuntimeType(['a']); // RuntimeType.Array
 * getRuntimeType({a: 'a'}); // RuntimeType.Object
 * ```
 *
 * @package @augment-vir/assert
 */
export function getRuntimeType(actual: unknown): RuntimeType {
    if (actual === null) {
        return RuntimeType.Null;
    } else if (Array.isArray(actual)) {
        return RuntimeType.Array;
    } else {
        return typeof actual as RuntimeType;
    }
}

/**
 * Asserts that the given actual matches the given test type. Note that an name for the actual must
 * be provided for error messaging purposes.
 */
function assertRuntimeType(
    actual: unknown,
    testType: RuntimeType | `${RuntimeType}`,
    failureMessage?: string | undefined,
) {
    const actualType = getRuntimeType(actual);
    if (actualType !== testType) {
        throw new AssertionError(
            `'${stringify(actual)}' is '${actualType}', not '${testType}'.`,
            failureMessage,
        );
    }
}
function assertNotRuntimeType(
    actual: unknown,
    testType: RuntimeType | `${RuntimeType}`,
    failureMessage?: string | undefined,
) {
    const actualType = getRuntimeType(actual);
    if (actualType === testType) {
        throw new AssertionError(`'${stringify(actual)}' is '${actualType}'.`, failureMessage);
    }
}
