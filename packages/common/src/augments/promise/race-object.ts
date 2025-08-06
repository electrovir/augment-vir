import {type Values} from '@augment-vir/core';

/**
 * Race all the given values and return the one that finished first.
 *
 * @category Promise
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export async function racePromiseObject<
    const PromiseObject extends Readonly<Record<string, Promise<any>>>,
>(
    promises: PromiseObject,
): Promise<{value: Awaited<Values<PromiseObject>>; key: keyof PromiseObject}> {
    return await Promise.race(
        Object.entries(promises).map(
            ([
                key,
                value,
            ]) => {
                return value.then((value) => {
                    return {
                        value,
                        key,
                    };
                });
            },
        ),
    );
}
