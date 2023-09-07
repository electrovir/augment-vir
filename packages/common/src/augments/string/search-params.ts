import {Primitive} from 'type-fest';
import {isTruthy} from '../boolean';
import {typedSplit} from '../common-string';
import {assertMatchesObjectShape} from '../object/matches-object-shape';
import {isRuntimeTypeOf} from '../runtime-type-of';
import {removePrefix} from './prefixes';

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

function splitSearchString(searchString: string): [string, string][] {
    const params = removePrefix({value: searchString, prefix: '?'}).split('&');

    const paramEntries = params
        .map((param): [string, string] | undefined => {
            const [
                key,
                ...everythingElse
            ] = typedSplit(param, '=');

            const value = everythingElse.join('');

            if (!value && !key) {
                return undefined;
            }

            return [
                key,
                value,
            ];
        })
        .filter(isTruthy);

    return paramEntries;
}

export function urlToSearchParamsObject<VerifyShapeGeneric extends SearchParamObjectBase>(
    inputUrl: string | Pick<URL, 'search'>,
    verifyShape: VerifyShapeGeneric,
): VerifyShapeGeneric;
export function urlToSearchParamsObject<VerifyShapeGeneric extends SearchParamObjectBase>(
    inputUrl: string | Pick<URL, 'search'>,
    verifyShape?: VerifyShapeGeneric | undefined,
): Record<string, string>;
export function urlToSearchParamsObject<VerifyShapeGeneric extends SearchParamObjectBase>(
    inputUrl: string | Pick<URL, 'search'>,
    verifyShape?: VerifyShapeGeneric | undefined,
): VerifyShapeGeneric | Record<string, string> {
    const ensuredUrl = isRuntimeTypeOf(inputUrl, 'string') ? new URL(inputUrl) : inputUrl;

    const searchEntries = splitSearchString(ensuredUrl.search);

    const paramsObject = Object.fromEntries(searchEntries);

    if (verifyShape) {
        assertMatchesObjectShape<SearchParamObjectBase>(paramsObject, verifyShape);
    }

    return paramsObject;
}
