import {AtLeastTuple, isPromiseLike, isTruthy, NoInputsFunction, UnPromise} from '..';

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

export function extractErrorMessage(error: unknown): string {
    if (!error) {
        return '';
    }

    if (error instanceof Error) {
        return error.message;
    } else {
        return String(error);
    }
}

export function ensureError(input: unknown): Error {
    if (input instanceof Error) {
        return input;
    } else {
        return new Error(extractErrorMessage(input));
    }
}

export function executeAndReturnError<CallbackGeneric extends NoInputsFunction<PromiseLike<any>>>(
    callback: CallbackGeneric,
): Promise<Error | UnPromise<ReturnType<CallbackGeneric>>>;
export function executeAndReturnError<CallbackGeneric extends NoInputsFunction>(
    callback: CallbackGeneric,
): Error | ReturnType<CallbackGeneric>;
export function executeAndReturnError<CallbackGeneric extends NoInputsFunction>(
    callback: CallbackGeneric,
): Promise<Error | UnPromise<ReturnType<CallbackGeneric>>> | Error | ReturnType<CallbackGeneric> {
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
