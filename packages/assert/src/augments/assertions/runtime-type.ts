import {UnknownObject, type AnyFunction} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';
import {NarrowToActual, NarrowToExpected} from './narrow-type.js';

function isArray(input: unknown, failureMessage?: string | undefined): asserts input is unknown[] {
    assertRuntimeType(input, 'array', failureMessage);
}
function isBigint(input: unknown, failureMessage?: string | undefined): asserts input is bigint {
    assertRuntimeType(input, 'bigint', failureMessage);
}
function isBoolean(input: unknown, failureMessage?: string | undefined): asserts input is boolean {
    assertRuntimeType(input, 'boolean', failureMessage);
}
function isFunction<const Actual>(
    input: Actual,
    failureMessage?: string | undefined,
): asserts input is NarrowToActual<Actual, AnyFunction> {
    assertRuntimeType(input, 'function', failureMessage);
}
function isNumber(input: unknown, failureMessage?: string | undefined): asserts input is number {
    assertRuntimeType(input, 'number', failureMessage);
}
function isObject(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is UnknownObject {
    assertRuntimeType(input, 'object', failureMessage);
}
function isString(input: unknown, failureMessage?: string | undefined): asserts input is string {
    assertRuntimeType(input, 'string', failureMessage);
}
function isSymbol(input: unknown, failureMessage?: string | undefined): asserts input is symbol {
    assertRuntimeType(input, 'symbol', failureMessage);
}
function isUndefined(
    input: unknown,
    failureMessage?: string | undefined,
): asserts input is undefined {
    assertRuntimeType(input, 'undefined', failureMessage);
}
function isNull(input: unknown, failureMessage?: string | undefined): asserts input is null {
    assertRuntimeType(input, 'null', failureMessage);
}

const assertions: {
    /**
     * This gross duplicate code is because of the following TypeScript Compiler limitation:
     *
     *     Assertions require every name in the call target to be declared with an explicit type annotation.ts(2775)
     */
    isArray: typeof isArray;
    isBigint: typeof isBigint;
    isBoolean: typeof isBoolean;
    isFunction: typeof isFunction;
    isNull: typeof isNull;
    isNumber: typeof isNumber;
    isObject: typeof isObject;
    isString: typeof isString;
    isSymbol: typeof isSymbol;
    isUndefined: typeof isUndefined;
} = {
    isArray,
    isBigint,
    isBoolean,
    isFunction,
    isNull,
    isNumber,
    isObject,
    isString,
    isSymbol,
    isUndefined,
};

export const runtimeTypeGuards = {
    assertions,
    checkOverrides: {
        isFunction:
            autoGuard<
                <const Actual>(
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => input is NarrowToActual<Actual, AnyFunction>
            >(),
    },
    assertWrapOverrides: {
        isFunction:
            autoGuard<
                <const Actual>(
                    input: Actual,
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
                    input: Actual,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Actual, symbol>
            >(),
    },
    checkWrapOverrides: {
        isFunction:
            autoGuard<
                <const Actual>(input: Actual) => NarrowToActual<Actual, AnyFunction> | undefined
            >(),
        /**
         * It doesn't make any sense for `checkWrap.isUndefined` to exist. If the input is
         * `undefined`, it returns `undefined`. If the input isn't `undefined`, it still returns
         * `undefined`.
         */
        isUndefined: undefined,
    },
    waitUntilOverrides: {
        isFunction:
            autoGuard<
                <const Actual>(
                    callback: () => Actual,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToActual<Actual, AnyFunction>>
            >(),
    },
} satisfies GuardGroup;

/** This function is not used at run time, it's only here for types. */
/* c8 ignore next 3 */
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

export function getRuntimeType(input: unknown): RuntimeType {
    if (input === null) {
        return 'null';
    } else if (Array.isArray(input)) {
        return 'array';
    } else {
        return typeof input;
    }
}

/**
 * Asserts that the given input matches the given test type. Note that an name for the input must be
 * provided for error messaging purposes.
 */
function assertRuntimeType(
    input: unknown,
    testType: RuntimeType,
    failureMessage?: string | undefined,
) {
    if (getRuntimeType(input) !== testType) {
        throw new AssertionError(
            failureMessage ||
                `Value is of type '${getRuntimeType(input)}' but type '${testType}' was expected.`,
        );
    }
}
