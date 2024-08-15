import {wrapInTry, type WrapInTryOptions} from '../function/wrap-in-try.js';

export function stringifyJson(
    jsonValue: unknown,
    {
        whitespace,
        ...tryOptions
    }: {
        whitespace?: number;
    } & WrapInTryOptions<string> = {},
): string {
    const result = wrapInTry(() => JSON.stringify(jsonValue, undefined, whitespace), tryOptions);

    if (result instanceof Error) {
        throw result;
    } else {
        return result;
    }
}
