import {hasProperty} from 'run-time-assertions';
import {RequireAtLeastOne} from 'type-fest';
import {ensureError} from '../error/ensure-error.js';
import {PartialWithUndefined} from '../object/partial-type.js';
import {MaybePromise} from '../promise/maybe-promise.js';
import {NoInputsFunction} from './generic-function-types.js';

/**
 * Options for {@link wrapInTry}.
 *
 * @category Try
 */
export type WrapInTryOptions<FallbackValue> = PartialWithUndefined<{
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
    options: RequireAtLeastOne<WrapInTryOptions<FallbackValue>>,
): Promise<Awaited<FallbackValue> | Awaited<Value>>;
export function wrapInTry<Value, FallbackValue = undefined>(
    callback: NoInputsFunction<Value>,
    options: RequireAtLeastOne<WrapInTryOptions<FallbackValue>>,
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
 * Executes the given callback within a try/catch block. And error or fallback value is returned or
 * a handler is called based on provided options.
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
