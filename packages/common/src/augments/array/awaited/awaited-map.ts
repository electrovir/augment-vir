export async function awaitedBlockingMap<OriginalGeneric, MappedGeneric>(
    input: ReadonlyArray<OriginalGeneric>,
    callback: (
        arrayElement: OriginalGeneric,
        index: number,
        wholeArray: ReadonlyArray<OriginalGeneric>,
    ) => MappedGeneric | PromiseLike<MappedGeneric>,
): Promise<Awaited<MappedGeneric>[]> {
    return await input.reduce(
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
}
