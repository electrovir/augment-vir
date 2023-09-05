import {Primitive} from 'type-fest';
import {isTruthy} from '../boolean';
import {assertMatchesObjectShape} from '../object/matches-object-shape';
import {isRuntimeTypeOf} from '../runtime-type-of';

export type SearchParamObjectBase = Record<string, Exclude<Primitive, symbol>>;

export function objectToSearchParamsString(inputObject: SearchParamObjectBase): string {
    const valueStrings = Object.entries(inputObject)
        .map(
            ([
                key,
                value,
            ]) => {
                if (value == undefined) {
                    return undefined;
                }
                return `${key}=${String(value)}`;
            },
        )
        .filter(isTruthy);

    if (valueStrings.length) {
        return `?${valueStrings.join('&')}`;
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
