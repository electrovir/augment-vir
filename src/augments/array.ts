export function filterOutIndexes<T>(array: Readonly<T[]>, indexes: Readonly<number[]>): T[] {
    return array.filter((_, index) => !indexes.includes(index));
}

export function flatten2dArray<T>(array2d: T[][]): T[] {
    const flattened: T[] = array2d.reduce((accum: T[], row) => accum.concat(row), []);

    return flattened;
}

export function trimArrayStrings(input: string[]): string[] {
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

export function isInTypedArray<T>(array: T[], input: any): input is T {
    return array.includes(input);
}
