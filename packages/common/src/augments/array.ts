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

/**
 * Acts like calling Array.prototype.forEach in that all elements are executed upon in order, and
 * each execution is blocking. Meaning, the callback won't be called on element 2 until the callback
 * has finished its call on element 1.
 */
export async function awaitedForEach<OriginalGeneric>(
    input: ReadonlyArray<OriginalGeneric>,
    callback: (
        arrayElement: OriginalGeneric,
        index: number,
        wholeArray: ReadonlyArray<OriginalGeneric>,
    ) => void | PromiseLike<void>,
): Promise<void> {
    await awaitedBlockingMap<OriginalGeneric, void | PromiseLike<void>>(input, callback);
}

export async function awaitedBlockingMap<OriginalGeneric, MappedGeneric>(
    input: ReadonlyArray<OriginalGeneric>,
    callback: (
        arrayElement: OriginalGeneric,
        index: number,
        wholeArray: ReadonlyArray<OriginalGeneric>,
    ) => MappedGeneric | PromiseLike<MappedGeneric>,
): Promise<Awaited<MappedGeneric>[]> {
    const mappedValues = await input.reduce(
        async (
            accumPromise: Promise<Awaited<MappedGeneric>[]>,
            currentElement,
            index,
            wholeArray,
        ) => {
            const accum = await accumPromise;
            const mappedValue = await callback(currentElement, index, wholeArray);
            accum.push(mappedValue);
            return accum;
        },
        Promise.resolve([]),
    );

    return mappedValues;
}

export function isInTypedArray<T>(array: ReadonlyArray<T>, input: any): input is T {
    return array.includes(input);
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
