import JSON5 from 'json5';

export function parseJson<ParsedJsonGeneric>({
    jsonString,
    errorHandler,
}: {
    jsonString: string;
    errorHandler?: (error: unknown) => never | ParsedJsonGeneric;
}): ParsedJsonGeneric {
    try {
        const parsedJson = JSON5.parse(jsonString);

        return parsedJson as ParsedJsonGeneric;
    } catch (error) {
        if (errorHandler) {
            return errorHandler(error);
        } else {
            throw error;
        }
    }
}
