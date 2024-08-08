export function filterOutIndexes<T>(array: ReadonlyArray<T>, indexes: ReadonlyArray<number>): T[] {
    return array.filter((_, index) => !indexes.includes(index));
}

export function filterMap<ElementType, MappedEntry, TypeGuarded extends MappedEntry>(
    inputArray: ReadonlyArray<ElementType>,
    mapCallback: (
        entry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => MappedEntry,
    filterCallback: (
        mappedOutput: MappedEntry,
        originalEntry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => mappedOutput is TypeGuarded,
): TypeGuarded[];
export function filterMap<ElementType, MappedEntry>(
    inputArray: ReadonlyArray<ElementType>,
    mapCallback: (
        entry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => MappedEntry,
    filterCallback: (
        mappedOutput: MappedEntry,
        originalEntry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => boolean,
): MappedEntry[];
export function filterMap<ElementType, MappedEntry>(
    inputArray: ReadonlyArray<ElementType>,
    mapCallback: (
        entry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => MappedEntry,
    filterCallback: (
        mappedOutput: MappedEntry,
        originalEntry: ElementType,
        index: number,
        originalArray: ReadonlyArray<ElementType>,
    ) => boolean,
): MappedEntry[] {
    return inputArray.reduce((accum: MappedEntry[], entry, index, originalArray) => {
        const mapOutput = mapCallback(entry, index, originalArray);
        const filterOutput = filterCallback(mapOutput, entry, index, originalArray);
        if (filterOutput) {
            accum.push(mapOutput);
        }
        return accum;
    }, []);
}
