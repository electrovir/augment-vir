import {assertRunTimeType, getRunTimeType, isRunTimeType} from 'run-time-assertions';
import {JsonCompatibleValue} from './json-compatible';
import {assertMatchesObjectShape} from './object/matches-object-shape';
import {WrapInTryOptions, wrapInTry} from './wrap-in-try';

export function parseJson<ParsedJsonGeneric>({
    jsonString,
    errorHandler,
    shapeMatcher,
}: {
    jsonString: string;
    errorHandler?: (error: unknown) => never | ParsedJsonGeneric;
    shapeMatcher?: ParsedJsonGeneric;
}): ParsedJsonGeneric {
    try {
        const parsedJson = JSON.parse(jsonString);

        if (shapeMatcher != undefined) {
            if (isRunTimeType(shapeMatcher, 'object')) {
                assertMatchesObjectShape<any>(parsedJson, shapeMatcher);
            } else {
                assertRunTimeType(parsedJson, getRunTimeType(shapeMatcher), 'parsedJson');
            }
        }

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
