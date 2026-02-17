import {type MaybePromise, type Tuple} from '@augment-vir/core';
import {createArray} from '../array/create-array.js';

/**
 * Executes the given callback a given count of times.
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {executeCount} from '@augment-vir/common';
 *
 * executeCount(5, (count) => console.log(count)); // will log: 1,2,3,4,5
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function executeCount<N extends number, T = void | undefined>(
    count: N,
    callback: (currentCount: number, totalCount: number) => T,
): Extract<T, Promise<any>> extends never
    ? Tuple<T, N>
    : Exclude<T, Promise<any>> extends never
      ? Promise<Tuple<Awaited<T>, N>>
      : MaybePromise<Tuple<Awaited<T>, N>> {
    return createArray(count, (index) => index + 1).reduce(
        (accum: MaybePromise<T[]>, currentCount) => {
            if (accum instanceof Promise) {
                return accum.then(async (awaitedAccum) => {
                    const result = await callback(currentCount, count);
                    awaitedAccum.push(result);
                    return awaitedAccum;
                });
            } else {
                const result = callback(currentCount, count);

                if (result instanceof Promise) {
                    return result.then((awaitedResult) => {
                        accum.push(awaitedResult);
                        return accum;
                    });
                } else {
                    accum.push(result);
                    return accum;
                }
            }
        },
        [],
    ) as any;
}
