import {awaitedBlockingMap} from './awaited-map.js';

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
