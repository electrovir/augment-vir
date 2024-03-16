import {assertRunTimeType, getRunTimeType, isRunTimeType} from 'run-time-assertions';
import {assertMatchesObjectShape} from './object/matches-object-shape';

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

export function stringifyJson({
    source,
    whitespace,
    errorHandler,
}: {
    source: unknown;
    whitespace?: number;
    errorHandler?: (error: unknown) => string | never;
}): string {
    try {
        const stringifiedJson = JSON.stringify(source, undefined, whitespace);

        return stringifiedJson;
    } catch (error) {
        if (errorHandler) {
            return errorHandler(error);
        } else {
            throw error;
        }
    }
}
