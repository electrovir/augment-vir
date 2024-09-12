import {type AnyObject, ensureError, getObjectTypedKeys} from '@augment-vir/core';

type InnerMappedValues<EntireInputGeneric extends object, MappedValueGeneric> = {
    [MappedProp in keyof EntireInputGeneric]: MappedValueGeneric;
};

type MappedValues<EntireInputGeneric extends object, MappedValueGeneric> =
    MappedValueGeneric extends PromiseLike<unknown>
        ? Promise<InnerMappedValues<EntireInputGeneric, Awaited<MappedValueGeneric>>>
        : InnerMappedValues<EntireInputGeneric, Awaited<MappedValueGeneric>>;

/**
 * Creates a new object with the same keys as the input object, but with values set to the result of
 * `mapCallback` for each property. This is the same as {@link mapObjectValues} except that this
 * preserves Promise values: it doesn't wrap them all in a single promise.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function mapObjectValuesSync<EntireInputGeneric extends object, MappedValueGeneric>(
    inputObject: EntireInputGeneric,
    mapCallback: (
        inputKey: keyof EntireInputGeneric,
        keyValue: Required<EntireInputGeneric>[typeof inputKey],
        fullObject: EntireInputGeneric,
    ) => MappedValueGeneric,
): InnerMappedValues<EntireInputGeneric, MappedValueGeneric> {
    const mappedObject = getObjectTypedKeys(inputObject).reduce<AnyObject>((accum, currentKey) => {
        const mappedValue = mapCallback(currentKey, inputObject[currentKey], inputObject);

        accum[currentKey] = mappedValue;

        return accum;
    }, {});
    return mappedObject as unknown as InnerMappedValues<EntireInputGeneric, MappedValueGeneric>;
}

/**
 * Creates a new object with the same keys as the input object, but with values set to the result of
 * `mapCallback` for each property. Automatically handles an async `mapCallback`.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {mapObjectValues} from '@augment-vir/common';
 *
 * mapObjectValues({a: 1, b: 2}, (key, value) => {
 *     return `key-${key} value-${value}`;
 * });
 * // output is `{a: 'key-a value-1', b: 'key-b value-2'}`
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function mapObjectValues<EntireInputGeneric extends object, MappedValueGeneric>(
    inputObject: EntireInputGeneric,
    mapCallback: (
        inputKey: keyof EntireInputGeneric,
        keyValue: Required<EntireInputGeneric>[typeof inputKey],
        fullObject: EntireInputGeneric,
    ) => MappedValueGeneric,
): MappedValues<EntireInputGeneric, MappedValueGeneric> {
    let gotAPromise = false as boolean;

    const mappedObject = getObjectTypedKeys(inputObject).reduce<AnyObject>((accum, currentKey) => {
        const mappedValue = mapCallback(currentKey, inputObject[currentKey], inputObject);
        if (mappedValue instanceof Promise) {
            gotAPromise = true;
        }
        accum[currentKey] = mappedValue;

        return accum;
    }, {});

    if (gotAPromise) {
        return new Promise<InnerMappedValues<EntireInputGeneric, Awaited<MappedValueGeneric>>>(
            async (resolve, reject) => {
                try {
                    await Promise.all(
                        getObjectTypedKeys(mappedObject).map(async (key) => {
                            const value = await mappedObject[key];
                            mappedObject[key] = value;
                        }),
                    );

                    resolve(
                        mappedObject as InnerMappedValues<
                            EntireInputGeneric,
                            Awaited<MappedValueGeneric>
                        >,
                    );
                } catch (error) {
                    reject(ensureError(error));
                }
            },
        ) as MappedValues<EntireInputGeneric, MappedValueGeneric>;
    } else {
        return mappedObject as unknown as MappedValues<EntireInputGeneric, MappedValueGeneric>;
    }
}
