import {AtLeastTuple} from './tuple';
import {ArrayElement} from './type';

export function filterOutIndexes<T>(array: ReadonlyArray<T>, indexes: ReadonlyArray<number>): T[] {
    return array.filter((_, index) => !indexes.includes(index));
}

export function flatten2dArray<T>(array2d: ReadonlyArray<ReadonlyArray<T>>): T[] {
    const flattened: T[] = array2d.reduce((accum: T[], row) => accum.concat(row), []);

    return flattened;
}

export type AtLeastOneEntryArray<ArrayGeneric extends ReadonlyArray<any>> = AtLeastTuple<
    ArrayElement<ArrayGeneric>,
    1
>;

export function trimArrayStrings(input: ReadonlyArray<string>): string[] {
    return input.map((line) => line.trim()).filter((line) => line !== '');
}

export function typedArrayIncludes<T>(array: ReadonlyArray<T>, input: unknown): input is T {
    return array.includes(input as T);
}

type MapCallbackType<ArrayType extends ReadonlyArray<any>, OutputType> = (
    value: ArrayElement<ArrayType>,
    index: number,
    array: ArrayType,
) => OutputType;

/**
 * This type should not be used outside of this file. This is used to match the
 * Array.prototype.map's callback type, which has insufficient type information, to our more
 * strictly typed MapCallbackType.
 */
type LibMapCallbackType<ArrayType extends ReadonlyArray<any>, OutputType> = (
    value: ArrayElement<ArrayType>,
    index: number,
    array: readonly ArrayElement<ArrayType>[],
) => OutputType;

/** Preserves tuple types. */
export function typedMap<InputArrayGeneric extends ReadonlyArray<any>, OutputType>(
    arrayToMap: InputArrayGeneric,
    mapCallback: MapCallbackType<InputArrayGeneric, OutputType>,
): {[Index in keyof InputArrayGeneric]: OutputType} {
    return arrayToMap.map(
        mapCallback as LibMapCallbackType<InputArrayGeneric, OutputType>,
    ) as unknown as {
        [Index in keyof InputArrayGeneric]: OutputType;
    };
}

export function repeatArray<T>(repeatCount: number, array: T[]): T[] {
    return Array.from({length: repeatCount}, () => [...array]).flat();
}

/**
 * Polyfill for `Object.groupBy`:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
 */
export function groupArrayBy<ElementType, NewKey extends PropertyKey>(
    inputArray: ReadonlyArray<ElementType>,
    callback: (
        entry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => NewKey,
): Record<NewKey, ElementType[]> {
    return inputArray.reduce(
        (accum, entry, index, originalArray) => {
            const key = callback(entry, index, originalArray);
            if (!(key in accum)) {
                accum[key] = [];
            }

            accum[key].push(entry);

            return accum;
        },
        {} as Record<NewKey, ElementType[]>,
    );
}
