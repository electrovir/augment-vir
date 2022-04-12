import {isTruthy} from './function';

export function combineErrors(errors: [Error, ...Error[]]): Error;
export function combineErrors(errors: never[]): undefined;
export function combineErrors(errors: Error[]): Error | undefined;
export function combineErrors(errors?: undefined): undefined;
export function combineErrors(errors?: Error[]): Error | undefined {
    if (!errors || errors.length === 0) {
        return undefined;
    }
    const firstError = errors[0];

    if (errors.length === 1 && firstError) {
        return firstError;
    }

    return new Error(errors.map((error) => extractErrorMessage(error).trim()).join('\n'));
}

export function combineErrorMessages(errors?: (Error | string | undefined)[] | undefined): string {
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
