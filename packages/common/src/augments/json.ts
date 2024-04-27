import {JsonCompatibleValue} from './json-compatible';
import {WrapInTryOptions, wrapInTry} from './wrap-in-try';

export function parseJson<ParsedJsonGeneric>({
    jsonString,
    errorHandler,
}: {
    jsonString: string;
    errorHandler?: (error: unknown) => never | ParsedJsonGeneric;
}): ParsedJsonGeneric {
    try {
        const parsedJson = JSON.parse(jsonString);

        return parsedJson as ParsedJsonGeneric;
    } catch (error) {
        if (errorHandler) {
            return errorHandler(error);
        } else {
            throw error;
        }
    }
}

export function stringifyJson(
    jsonValue: JsonCompatibleValue,
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
