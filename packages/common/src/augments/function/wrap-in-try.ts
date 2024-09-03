import {check} from '@augment-vir/assert';
import {
    ensureError,
    type MaybePromise,
    type NoInputsFunction,
    type PartialWithUndefined,
} from '@augment-vir/core';

/** Options for {@link wrapInTry}. */
export type WrapInTryOptions<FallbackValue> = PartialWithUndefined<{
    /**
     * Call this function if the callback passed to {@link wrapInTry} throws an error. The thrown
     * error is passed to this function. If a `fallbackValue` option is also provided, it will be
     * ignored.
     */
    handleError: (error: unknown) => FallbackValue;
    /**
     * Fallback to this value if the callback passed to {@link wrapInTry} throws an error. This will
     * be ignored if a `handleError` option is also set.
     */
    fallbackValue: FallbackValue;
}>;

export function wrapInTry<Value extends Promise<any>>(
    callback: NoInputsFunction<Value>,
    options?:
        | undefined
        | {
              handleError?: never;
              fallbackValue?: never;
          },
): Promise<Error | Awaited<Value>>;
export function wrapInTry<Value>(
    callback: NoInputsFunction<Value>,
    options?:
        | undefined
        | {
              handleError?: never;
              fallbackValue?: never;
          },
): Error | Value;

export function wrapInTry<Value extends Promise<any>, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options: {
        handleError: (error: unknown) => FallbackValue;
        fallbackValue?: FallbackValue;
    },
): Promise<Awaited<FallbackValue> | Awaited<Value>>;
export function wrapInTry<Value, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options: {
        handleError: (error: unknown) => FallbackValue;
        fallbackValue?: FallbackValue;
    },
): FallbackValue | Value;
export function wrapInTry<Value extends Promise<any>, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options: {
        handleError?: ((error: unknown) => FallbackValue) | undefined;
        fallbackValue: FallbackValue;
    },
): Promise<Awaited<FallbackValue> | Awaited<Value>>;
export function wrapInTry<Value, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options: {
        handleError?: ((error: unknown) => FallbackValue) | undefined;
        fallbackValue: FallbackValue;
    },
): FallbackValue | Value;

export function wrapInTry<Value extends Promise<any>, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options?: WrapInTryOptions<FallbackValue> | undefined,
): Promise<FallbackValue | Value | Error>;
export function wrapInTry<Value, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options?: WrapInTryOptions<FallbackValue> | undefined,
): FallbackValue | Value | Error;

/**
 * Calls the callback and returns its output. If the callback throws an error, it is handled in the
 * following ways:
 *
 * - If a `handleError` function is provided in `options`, it is passed the thrown error. The output
 *   of `handleError` is returned by `wrapInTry`.
 * - If a `fallbackValue` is provided, it is returned by `wrapInTry`. The thrown error is ignored.
 * - If no options are provided, the thrown error is returned by `wrapInTry`.
 *
 * @category Function : Common
 * @example
 *
 * ```ts
 * import {wrapInTry} from '@augment-vir/common';
 *
 * // `result1` will be `'success'`.
 * const result1 = wrapInTry(
 *     () => {
 *         return 'success';
 *     },
 *     {
 *         fallbackValue: 'failure',
 *     },
 * );
 * // `result2` will be `'failure'`.
 * const result2 = wrapInTry(
 *     () => {
 *         throw new Error();
 *         return 'success';
 *     },
 *     {
 *         fallbackValue: 'failure',
 *     },
 * );
 * // `result3` will be `'failure also'`.
 * const result3 = wrapInTry(
 *     () => {
 *         throw new Error();
 *         return 'success';
 *     },
 *     {
 *         handleError() {
 *             return 'failure also';
 *         },
 *     },
 * );
 * // `result4` will be `'failure also'`.
 * const result4 = wrapInTry(
 *     () => {
 *         throw new Error();
 *         return 'success';
 *     },
 *     {
 *         handleError() {
 *             return 'failure also';
 *         },
 *         fallbackValue: 'ignored',
 *     },
 * );
 * ```
 *
 * @package @augment-vir/common
 */
export function wrapInTry<Value, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options: WrapInTryOptions<FallbackValue> | undefined = {},
): MaybePromise<FallbackValue | Value | Error> {
    try {
        const value = callback();

        if (value instanceof Promise) {
            return value.catch((error: unknown) => {
                if (options.handleError) {
                    return options.handleError(error);
                } else if (check.hasKey(options, 'fallbackValue')) {
                    return options.fallbackValue;
                } else {
                    return ensureError(error);
                }
            });
        } else {
            return value;
        }
    } catch (error) {
        if (options.handleError) {
            return options.handleError(error);
        } else if (check.hasKey(options, 'fallbackValue')) {
            return options.fallbackValue as FallbackValue;
        } else {
            return ensureError(error);
        }
    }
}
