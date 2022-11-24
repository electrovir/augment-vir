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

export async function awaitedFilter<OriginalGeneric>(
    arrayInput: ReadonlyArray<OriginalGeneric>,
    filterCallback: (
        arrayElement: OriginalGeneric,
        index: number,
        wholeArray: ReadonlyArray<OriginalGeneric>,
    ) => Promise<unknown>,
    options?: {
        /**
         * Each call to the filter callback is blocking, meaning the next one won't start until the
         * current one finishes. By default this is false.
         */
        blocking?: boolean | undefined;
    },
): Promise<OriginalGeneric[]> {
    const callbackResults: unknown[] = options?.blocking
        ? await awaitedBlockingMap(arrayInput, filterCallback)
        : await Promise.all(arrayInput.map(filterCallback));

    return arrayInput.filter((originalValue, index) => !!callbackResults[index]);
}
