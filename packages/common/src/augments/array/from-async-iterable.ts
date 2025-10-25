/**
 * Convert an async iterator or async iterable into an array.
 *
 * @category Array
 * @category Package : @augment-vir/common
 */
export async function fromAsyncIterable<T>(
    asyncInput: AsyncIterable<T> | AsyncIterator<T>,
): Promise<T[]> {
    const collapsed: T[] = [];

    if (isAsyncIterable<T>(asyncInput)) {
        for await (const entry of asyncInput) {
            collapsed.push(entry);
        }
        return collapsed;
    } else if (isAsyncIterator<T>(asyncInput)) {
        for (;;) {
            const {value, done} = await asyncInput.next();
            if (done) {
                break;
            }
            collapsed.push(value);
        }
        return collapsed;
    } else {
        throw new TypeError('Input is neither AsyncIterable nor AsyncIterator.');
    }
}

function isAsyncIterable<T>(value: any): value is AsyncIterable<T> {
    return typeof value[Symbol.asyncIterator] === 'function';
}

function isAsyncIterator<T>(value: any): value is AsyncIterator<T> {
    return typeof value.next === 'function';
}
