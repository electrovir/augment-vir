import {hasProperty} from 'run-time-assertions';
import {ensureError} from './error';
import {NoInputsFunction} from './function';
import {PartialAndUndefined} from './object/object';
import {MaybePromise} from './promise/promise';

export type WrapInTryOptions<FallbackValue> = PartialAndUndefined<{
    /**
     * A callback that is passed the error. The output of this callback is returned by `wrapInTry`.
     * This takes precedence over the other two options.
     */
    handleError: (error: unknown) => FallbackValue;
    /**
     * Fallback to this value if the callback passed to `wrapInTry` throws an error. Takes
     * precedence over `returnError`.
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

export function wrapInTry<Value, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options: WrapInTryOptions<FallbackValue> | undefined = {},
): MaybePromise<FallbackValue | Value | Error> {
    try {
        const value = callback();

        if (value instanceof Promise) {
            return value.catch((error) => {
                if (options.handleError) {
                    return options.handleError(error);
                } else if (hasProperty(options, 'fallbackValue')) {
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
        } else if (hasProperty(options, 'fallbackValue')) {
            return options.fallbackValue as FallbackValue;
        } else {
            return ensureError(error);
        }
    }
}
