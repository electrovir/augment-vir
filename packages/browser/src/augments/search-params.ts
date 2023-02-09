import {assertMatchesObjectShape, isRuntimeTypeOf} from '@augment-vir/common';

export function objectToSearchParamsString(inputObject: Record<string, string>): string {
    const searchParams = new URLSearchParams(Object.entries(inputObject));

    const searchParamsString = searchParams.toString();

    if (searchParamsString) {
        return `?${searchParamsString}`;
    } else {
        return '';
    }
}

export function searchParamStringToObject<VerifyShapeGeneric extends Record<string, string>>(
    inputUrl: string | Pick<URL, 'searchParams'>,
    verifyShape: VerifyShapeGeneric,
): VerifyShapeGeneric;
export function searchParamStringToObject<VerifyShapeGeneric extends Record<string, string>>(
    inputUrl: string | Pick<URL, 'searchParams'>,
    verifyShape?: VerifyShapeGeneric | undefined,
): Record<string, string>;
export function searchParamStringToObject<VerifyShapeGeneric extends Record<string, string>>(
    inputUrl: string | Pick<URL, 'searchParams'>,
    verifyShape?: VerifyShapeGeneric | undefined,
): VerifyShapeGeneric | Record<string, string> {
    const urlForSearchParams = isRuntimeTypeOf(inputUrl, 'string') ? new URL(inputUrl) : inputUrl;

    const searchEntries = Array.from(urlForSearchParams.searchParams.entries());

    const paramsObject = Object.fromEntries(searchEntries);

    if (verifyShape) {
        assertMatchesObjectShape<Record<string, string>>(paramsObject, verifyShape);
    }

    return paramsObject;
}
