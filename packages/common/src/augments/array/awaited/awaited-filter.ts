import {awaitedBlockingMap} from './awaited-map.js';

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
