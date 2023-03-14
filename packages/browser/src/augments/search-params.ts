import {
    assertMatchesObjectShape,
    filterObject,
    isRuntimeTypeOf,
    mapObjectValues,
} from '@augment-vir/common';
import {Primitive} from 'type-fest';

export type SearchParamObjectBase = Record<string, Exclude<Primitive, symbol>>;

export function objectToSearchParamsString(inputObject: SearchParamObjectBase): string {
    const filteredInputs = filterObject(inputObject, (key, value) => {
        return value != undefined;
    });
    const stringifiedInputs = mapObjectValues(filteredInputs, (key, value) => String(value));

    const searchParams = new URLSearchParams(Object.entries(stringifiedInputs));

    const searchParamsString = searchParams.toString();

    if (searchParamsString) {
        return `?${searchParamsString}`;
    } else {
        return '';
    }
}

export function searchParamStringToObject<VerifyShapeGeneric extends SearchParamObjectBase>(
    inputUrl: string | Pick<URL, 'searchParams'>,
    verifyShape: VerifyShapeGeneric,
): VerifyShapeGeneric;
export function searchParamStringToObject<VerifyShapeGeneric extends SearchParamObjectBase>(
    inputUrl: string | Pick<URL, 'searchParams'>,
    verifyShape?: VerifyShapeGeneric | undefined,
): Record<string, string>;
export function searchParamStringToObject<VerifyShapeGeneric extends SearchParamObjectBase>(
    inputUrl: string | Pick<URL, 'searchParams'>,
    verifyShape?: VerifyShapeGeneric | undefined,
): VerifyShapeGeneric | Record<string, string> {
    const urlForSearchParams = isRuntimeTypeOf(inputUrl, 'string') ? new URL(inputUrl) : inputUrl;

    const searchEntries = Array.from(urlForSearchParams.searchParams.entries());

    const paramsObject = Object.fromEntries(searchEntries);

    if (verifyShape) {
        assertMatchesObjectShape<SearchParamObjectBase>(paramsObject, verifyShape);
    }

    return paramsObject;
}
