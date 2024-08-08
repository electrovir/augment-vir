import {ArrayElement} from './array-element.js';
import {AtLeastTuple} from './tuple.js';

export type AtLeastOneEntryArray<ArrayGeneric extends ReadonlyArray<any>> = AtLeastTuple<
    ArrayElement<ArrayGeneric>,
    1
>;

export function isLengthAtLeast<ArrayElementGeneric, LengthGeneric extends number>(
    array: ReadonlyArray<ArrayElementGeneric | undefined>,
    length: LengthGeneric,
): array is AtLeastTuple<ArrayElementGeneric, LengthGeneric> {
    try {
        assertLengthAtLeast(array, length);
        return true;
    } catch {
        return false;
    }
}

export function assertLengthAtLeast<ArrayElementGeneric, LengthGeneric extends number>(
    array: ReadonlyArray<ArrayElementGeneric | undefined>,
    length: LengthGeneric,
    arrayName?: string,
): asserts array is AtLeastTuple<ArrayElementGeneric, LengthGeneric> {
    if (array.length < length) {
        throw new Error(
            arrayName
                ? `'${arrayName}' is not at least '${length}' in length.`
                : `Array is not at least '${length}' in length.`,
        );
    }
}
