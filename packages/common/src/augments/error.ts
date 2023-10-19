import {RequireExactlyOne} from 'type-fest';
import {AtLeastTuple, NoInputsFunction, isPromiseLike, isTruthy, typedHasProperty} from '..';

export function combineErrors(errors: AtLeastTuple<Error, 1>): Error;
export function combineErrors(errors: ReadonlyArray<never>): undefined;
export function combineErrors(errors: ReadonlyArray<Error>): Error | undefined;
export function combineErrors(errors?: undefined): undefined;
export function combineErrors(
    errors?: AtLeastTuple<Error, 1> | undefined | ReadonlyArray<never> | ReadonlyArray<Error>,
): Error | undefined {
    if (!errors || errors.length === 0) {
        return undefined;
    }
    const firstError = errors[0];

    if (errors.length === 1 && firstError) {
        return firstError;
    }

    return new Error(errors.map((error) => extractErrorMessage(error).trim()).join('\n'));
}

export function combineErrorMessages(
    errors?: ReadonlyArray<Error | string | undefined> | undefined,
): string {
    if (!errors) {
        return '';
    }

    return errors.map(extractErrorMessage).filter(isTruthy).join('\n');
}

export function extractErrorMessage(maybeError: unknown): string {
    if (!maybeError) {
        return '';
    }

    if (maybeError instanceof Error) {
        return maybeError.message;
    } else if (typedHasProperty(maybeError, 'message')) {
        return String(maybeError.message);
    } else {
        return String(maybeError);
    }
}

export function ensureError(maybeError: unknown): Error {
    if (maybeError instanceof Error) {
        return maybeError;
    } else {
        return new Error(extractErrorMessage(maybeError));
    }
}

export function ensureErrorAndPrependMessage(maybeError: unknown, prependMessage: string): Error {
    const error = ensureError(maybeError);
    error.message = `${prependMessage}: ${error.message}`;
    return error;
}

export type TryWrapInputs<CallbackReturn, FallbackReturn> = {
    callback: () => CallbackReturn;
} & RequireExactlyOne<{
    fallbackValue: FallbackReturn;
    catchCallback: (error: unknown) => FallbackReturn;
}>;

export function wrapInTry<CallbackReturn, FallbackReturn>(
    inputs: TryWrapInputs<CallbackReturn, FallbackReturn>,
): FallbackReturn | CallbackReturn {
    try {
        const returnValue = inputs.callback();

        if (returnValue instanceof Promise) {
            return returnValue.catch((error) => {
                if (inputs.catchCallback) {
                    return inputs.catchCallback(error);
                } else {
                    return inputs.fallbackValue;
                }
            }) as FallbackReturn | CallbackReturn;
        } else {
            return returnValue;
        }
    } catch (error) {
        if (inputs.catchCallback) {
            return inputs.catchCallback(error);
        } else {
            return inputs.fallbackValue;
        }
    }
}

export function executeAndReturnError<CallbackGeneric extends NoInputsFunction<PromiseLike<any>>>(
    callback: CallbackGeneric,
): Promise<Error | Awaited<ReturnType<CallbackGeneric>>>;
export function executeAndReturnError<CallbackGeneric extends NoInputsFunction>(
    callback: CallbackGeneric,
): Error | ReturnType<CallbackGeneric>;
export function executeAndReturnError<CallbackGeneric extends NoInputsFunction>(
    callback: CallbackGeneric,
): Promise<Error | Awaited<ReturnType<CallbackGeneric>>> | Error | ReturnType<CallbackGeneric> {
    let caughtError: Error | undefined;

    try {
        const result: ReturnType<CallbackGeneric> = callback();

        if (isPromiseLike(result)) {
            return new Promise<Error | ReturnType<CallbackGeneric>>(async (resolve) => {
                try {
                    const output = await result;
                    return resolve(output);
                } catch (error) {
                    caughtError = ensureError(error);
                }

                return resolve(caughtError);
            });
        } else {
            return result;
        }
    } catch (error) {
        caughtError = ensureError(error);
    }

    return caughtError;
}
