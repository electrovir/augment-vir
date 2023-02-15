import {assertMatchesObjectShape} from './object/matches-object-shape';
import {assertRuntimeTypeOf, getRuntimeTypeOf, isRuntimeTypeOf} from './runtime-type-of';

export function parseJson<ParsedJsonGeneric>({
    jsonString,
    errorHandler,
    shapeMatcher,
}: {
    jsonString: string;
    errorHandler?: (error: unknown) => void;
    shapeMatcher?: ParsedJsonGeneric;
}): ParsedJsonGeneric {
    try {
        const parsedJson = JSON.parse(jsonString);

        if (shapeMatcher != undefined) {
            if (isRuntimeTypeOf(shapeMatcher, 'object')) {
                assertMatchesObjectShape<any>(parsedJson, shapeMatcher);
            } else {
                assertRuntimeTypeOf(parsedJson, getRuntimeTypeOf(shapeMatcher), 'parsedJson');
            }
        }

        return parsedJson as ParsedJsonGeneric;
    } catch (error) {
        errorHandler?.(error);
        // if the above error handler doesn't halt execution then this will
        throw error;
    }
}
