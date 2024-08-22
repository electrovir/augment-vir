import {
    AnyFunction,
    MaybePromise,
    NarrowToActual,
    NarrowToExpected,
    stringify,
    UnknownObject,
} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import type {GuardGroup} from '../augments/guard-types/guard-group.js';
import {autoGuard} from '../augments/guard-types/guard-override.js';
import {WaitUntilOptions} from '../augments/guard-types/wait-until-function.js';

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
     * This gross duplicate code is because of the following TypeScript Compiler limitation:
     *
     *     Assertions require every name in the call target to be declared with an explicit type annotation.ts(2775)
     */
    isArray: typeof isArray;
    isBigInt: typeof isBigInt;
    isBoolean: typeof isBoolean;
    isFunction: typeof isFunction;
    isNull: typeof isNull;
    isNumber: typeof isNumber;
    isObject: typeof isObject;
    isString: typeof isString;
    isSymbol: typeof isSymbol;
    isUndefined: typeof isUndefined;
    isNotArray: typeof isNotArray;
    isNotBigInt: typeof isNotBigInt;
    isNotBoolean: typeof isNotBoolean;
    isNotFunction: typeof isNotFunction;
    isNotNumber: typeof isNotNumber;
    isNotObject: typeof isNotObject;
    isNotString: typeof isNotString;
    isNotSymbol: typeof isNotSymbol;
    isNotUndefined: typeof isNotUndefined;
    isNotNull: typeof isNotNull;
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
    isNotNumber,
    isNotObject,
    isNotString,
    isNotSymbol,
    isNotUndefined,
    isNotNull,
};

export const runtimeTypeGuards = {
    assertions,
    checkOverrides: {
        isFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is NarrowToActual<Actual, AnyFunction>
            >(),
        isNotArray:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, ReadonlyArray<unknown>>
            >(),
        isNotBigInt:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, bigint>
            >(),
        isNotBoolean:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, boolean>
            >(),
        isNotFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, AnyFunction>
            >(),
        isNotNull:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, null>
            >(),
        isNotNumber:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, number>
            >(),
        isNotObject:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, UnknownObject>
            >(),
        isNotString:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, string>
            >(),
        isNotUndefined:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, undefined>
            >(),
        isNotSymbol:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => actual is Exclude<Actual, symbol>
            >(),
    },
    assertWrapOverrides: {
        isFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => NarrowToActual<Actual, AnyFunction>
            >(),
        /**
         * Trying to assign a unique symbol to another variable kills the `unique` part of the
         * symbol. this seems to be a bug with TypeScript itself.
         *
         * For some reason `checkWrap` does not suffer from this issue though.
         *
         * @example
         *     const mySymbol = Symbol('mine');
         *     const mySymbol2 = mySymbol; // this is no longer `unique symbol`
         */
        isSymbol:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, symbol>
            >(),
        isNotArray:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, ReadonlyArray<unknown>>
            >(),
        isNotBigInt:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, bigint>
            >(),
        isNotBoolean:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, boolean>
            >(),
        isNotFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, AnyFunction>
            >(),
        isNotNull:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, null>
            >(),
        isNotNumber:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, number>
            >(),
        isNotObject:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, UnknownObject>
            >(),
        isNotString:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, string>
            >(),
        isNotUndefined:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, undefined>
            >(),
        isNotSymbol:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, symbol>
            >(),
    },
    checkWrapOverrides: {
        isFunction:
            autoGuard<
                <const Actual>(actual: Actual) => NarrowToActual<Actual, AnyFunction> | undefined
            >(),
        /**
         * It doesn't make any sense for `checkWrap.isUndefined` to exist. If the input is
         * `undefined`, it returns `undefined`. If the input isn't `undefined`, it still returns
         * `undefined`.
         */
        isUndefined: undefined,
        /**
         * It doesn't make any sense for `checkWrap.isNotUndefined` to exist. If the input is not
         * `undefined`, then it still returns `undefined`.
         */
        isNotUndefined: undefined,
        isNotArray:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, ReadonlyArray<unknown>> | undefined
            >(),
        isNotBigInt:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, bigint> | undefined
            >(),
        isNotBoolean:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, boolean> | undefined
            >(),
        isNotFunction:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, AnyFunction> | undefined
            >(),
        isNotNull:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, null> | undefined
            >(),
        isNotNumber:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, number> | undefined
            >(),
        isNotObject:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, UnknownObject> | undefined
            >(),
        isNotString:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, string> | undefined
            >(),
        isNotSymbol:
            autoGuard<
                <const Actual>(
                    actual: Actual,
                    failureMessage?: string | undefined,
                ) => Exclude<Actual, symbol> | undefined
            >(),
    },
    waitUntilOverrides: {
        isFunction:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToActual<Actual, AnyFunction>>
            >(),
        isNotArray:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, ReadonlyArray<unknown>>>
            >(),
        isNotBigInt:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, bigint>>
            >(),
        isNotBoolean:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, boolean>>
            >(),
        isNotFunction:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, AnyFunction>>
            >(),
        isNotNull:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, null>>
            >(),
        isNotNumber:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, number>>
            >(),
        isNotObject:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, UnknownObject>>
            >(),
        isNotString:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, string>>
            >(),
        isNotUndefined:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, undefined>>
            >(),
        isNotSymbol:
            autoGuard<
                <const Actual>(
                    callback: () => MaybePromise<Actual>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Actual, symbol>>
            >(),
    },
} satisfies GuardGroup;

/** This function is not used at run time, it's only here for types. */
/* /* node:coverage ignore next 4 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rawGetTypeOf(x: any) {
    return typeof x;
}

/** Raw outputs from the typeof operator. */
type RawTypeOf = ReturnType<typeof rawGetTypeOf>;

/**
 * The available run-time type options. In addition to the options returned by the built-in `typeof`
 * operator, this adds `'array'` and `'null'` as type strings.
 */
export type RuntimeType = RawTypeOf | 'array' | 'null';

export function getRuntimeType(actual: unknown): RuntimeType {
    if (actual === null) {
        return 'null';
    } else if (Array.isArray(actual)) {
        return 'array';
    } else {
        return typeof actual;
    }
}

/**
 * Asserts that the given actual matches the given test type. Note that an name for the actual must
 * be provided for error messaging purposes.
 */
function assertRuntimeType(
    actual: unknown,
    testType: RuntimeType,
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
    testType: RuntimeType,
    failureMessage?: string | undefined,
) {
    const actualType = getRuntimeType(actual);
    if (actualType === testType) {
        throw new AssertionError(`'${stringify(actual)}' is '${actualType}'.`, failureMessage);
    }
}
